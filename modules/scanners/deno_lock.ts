import type { DependencyProfile, Scanner } from '../types.ts';

import { JsrInlineScanner } from './jsr_inline.ts';
import { NpmInlineScanner } from './npm_inline.ts';
import { DenolandInlineScanner } from './denoland_inline.ts';

export class DenoLockScanner implements Scanner {
  static async load(path: string): Promise<Record<string, unknown>> {
    const raw = await Deno.readTextFile(path);
    return JSON.parse(raw);
  }

  static guard(path: string): boolean {
    return path.endsWith('deno.lock');
  }

  static rules = [
    //
    JsrInlineScanner,
    NpmInlineScanner,
    DenolandInlineScanner,
  ];

  async scan(path: string): Promise<DependencyProfile[]> {
    if (!DenoLockScanner.guard(path)) return [];
    const record = await DenoLockScanner.load(path).then((json) => [
      ...Object.keys(json.remote as Record<string, string>),
      ...Object.values(
        (json.packages as Record<string, Record<string, string>>).specifiers,
      ),
    ]);

    let profiles: DependencyProfile[] = [];
    for (const literal of Object.values<string>(record)) {
      for (const Rule of DenoLockScanner.rules) {
        if (Rule.guard(literal)) {
          const inlineProfiles = await new Rule().scan(literal).then((p) =>
            p.filter((e) =>
              profiles.findIndex((al) =>
                al.name === e.name && al.version === e.version &&
                al.provider === e.provider && al.modifier === e.modifier
              ) === -1
            )
          );

          inlineProfiles.forEach((profile) => {
            profile.files.push(path);
          });
          profiles = profiles.concat(inlineProfiles);
        }
      }
    }
    return profiles;
  }
}
