import type { DependencyProfile, Scanner } from '../types.ts';

import { JsrInlineScanner } from './jsr_inline.ts';
import { NpmInlineScanner } from './npm_inline.ts';
import { DenolandInlineScanner } from './denoland_inline.ts';

const regex = /(?:import|export|from) ["'](?<source>[^;]+)["'];/gm;

export class Es6FileScanner implements Scanner {
  static guard(path: string): boolean {
    return regex.test(path);
  }

  static rules = [
    //
    JsrInlineScanner,
    NpmInlineScanner,
    DenolandInlineScanner,
  ];

  async scan(path: string): Promise<DependencyProfile[]> {
    let profiles: DependencyProfile[] = [];
    for (const m of path.matchAll(regex)) {
      const literal = m.groups?.source || '';
      for (const Rule of Es6FileScanner.rules) {
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
