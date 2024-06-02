import type { DependencyProfile, Scanner } from '../types.ts';

import { Es6FileScanner } from './es6.ts';

export class TypeScriptFileScanner implements Scanner {
  static guard(path: string): boolean {
    return ['.ts', '.mts'].some((ext) => path.endsWith(ext));
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const content = await Deno.readTextFile(path);
    const matches = await new Es6FileScanner().scan(content);
    matches.forEach((d) => d.files.push(path));
    return matches;
  }
}
