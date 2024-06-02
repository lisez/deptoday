import type { DependencyProfile, Scanner } from '../types.ts';

import { InlineScanner } from './inline.ts';

export class DenoJsonScanner implements Scanner {
  static async load(path: string): Promise<Record<string, unknown>> {
    const raw = await Deno.readTextFile(path);
    return JSON.parse(raw);
  }

  static guard(path: string): boolean {
    return path.endsWith('deno.json');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const record = await DenoJsonScanner.load(path).then((json) =>
      Object.values(json.imports as Record<string, string>)
    );
    return InlineScanner.Multiple(record).then((e) => {
      e.forEach((d) => {
        d.files.push(path);
      });
      return e;
    });
  }
}
