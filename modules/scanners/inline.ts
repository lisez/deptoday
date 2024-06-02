import type { DependencyProfile, Scanner } from '../types.ts';

import { JsrInlineScanner } from './jsr_inline.ts';
import { NpmInlineScanner } from './npm_inline.ts';
import { DenolandInlineScanner } from './denoland_inline.ts';
import * as helpers from '../helpers/intersect.ts';

export class InlineScanner implements Scanner {
  static async Multiple(paths: string[]): Promise<DependencyProfile[]> {
    let profiles: DependencyProfile[] = [];
    for (const path of paths) {
      const inlineProfiles = await new InlineScanner().scan(path);
      const newProfiles = helpers.intersect(inlineProfiles, profiles);
      profiles = profiles.concat(newProfiles);
    }
    return profiles;
  }

  static guard(path: string): boolean {
    return !!path;
  }

  static rules = [
    //
    JsrInlineScanner,
    NpmInlineScanner,
    DenolandInlineScanner,
  ];

  async scan(path: string): Promise<DependencyProfile[]> {
    let profiles: DependencyProfile[] = [];
    for (const Rule of InlineScanner.rules) {
      if (Rule.guard(path)) {
        const inlineProfiles = await new Rule().scan(path);
        const newProfiles = helpers.intersect(inlineProfiles, profiles);
        newProfiles.forEach((profile) => {
          profile.files.push(path);
        });
        profiles = profiles.concat(newProfiles);
      }
    }

    return profiles;
  }
}
