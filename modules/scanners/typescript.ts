import type { DependencyProfile, Scanner } from '../types.ts';

import { EsmFileScanner } from './esm.ts';

export class TypeScriptFileScanner implements Scanner {
  static guard(path: string): boolean {
    return ['.ts', '.mts'].some((ext) => path.endsWith(ext));
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const content = await Deno.readTextFile(path);
    const matches = await new EsmFileScanner().scan(content);
    matches.forEach((d) => d.files.push(path));
    return matches;
  }
}
