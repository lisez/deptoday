import type { DependencyProfile, Scanner } from '../types.ts';

import { InlineScanner } from './inline.ts';
import * as helpers from '../helpers/intersect.ts';

export class DenoLockScanner implements Scanner {
  static async load(path: string): Promise<Record<string, unknown>> {
    const raw = await Deno.readTextFile(path);
    return JSON.parse(raw);
  }

  static guard(path: string): boolean {
    return path.endsWith('deno.lock');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const record = await DenoLockScanner.load(path).then((json) => [
      ...Object.keys(json.remote as Record<string, string>),
      ...Object.values(
        (json.packages as Record<string, Record<string, string>>).specifiers,
      ),
    ]);

    return InlineScanner.Multiple(Object.values(record));
  }
}
