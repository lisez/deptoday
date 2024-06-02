import type { DependencyProfile, Scanner } from '../types.ts';

import { DenoLockScanner } from './deno_lock.ts';
import { DenoJsonScanner } from './deno_json.ts';
import { Es6FileScanner } from './es6.ts';
import { TypeScriptFileScanner } from './typescript.ts';

export class FileScanner implements Scanner {
  async scan(path: string): Promise<DependencyProfile[]> {
    switch (true) {
      case TypeScriptFileScanner.guard(path):
        return new TypeScriptFileScanner().scan(path);
      case DenoLockScanner.guard(path):
        return new DenoLockScanner().scan(path);
      case DenoJsonScanner.guard(path):
        return new DenoJsonScanner().scan(path);
      default:
        return [];
    }
  }
}
