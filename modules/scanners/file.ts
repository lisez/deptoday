import type { DependencyProfile, Scanner } from "../types.ts";

import { DenoLockScanner } from "./deno_lock.ts";

export class FileScanner implements Scanner {
  async scan(path: string): Promise<DependencyProfile[]> {
    switch (true) {
      case DenoLockScanner.guard(path):
        return new DenoLockScanner().scan(path);
      default:
        return [];
    }
  }
}
