import type { DependencyProfile, Scanner } from 'modules/types.ts';

import { JsrInlineScanner } from 'modules/scanners/jsr_inline.ts';
import { NpmInlineScanner } from 'modules/scanners/npm_inline.ts';

export class DenoLockScanner implements Scanner {
  static async #loadFile(path: string): Promise<Record<string, string>> {
    const raw = await Deno.readTextFile(path);
    return JSON.parse(raw).packages.specifiers;
  }

  static guard(path: string): boolean {
    return path.endsWith('deno.lock');
  }

  static rules = [
    //
    JsrInlineScanner,
    NpmInlineScanner,
  ];

  async scan(path: string): Promise<DependencyProfile[]> {
    if (!DenoLockScanner.guard(path)) return [];
    const record = await DenoLockScanner.#loadFile(path);

    let profiles: DependencyProfile[] = [];
    for (const literal of Object.values<string>(record)) {
      for (const Rule of DenoLockScanner.rules) {
        if (Rule.guard(literal)) {
          const inlineProfiles = await new Rule().scan(literal);
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
