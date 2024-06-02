import * as pathlib from 'jsr:@std/path';

import { DependencyProfile, Scanner } from 'modules/types.ts';
import { DirectoryScanner } from 'modules/scanners/directory.ts';
import { FileScanner } from 'modules/scanners/file.ts';

export class PathScanner implements Scanner {
  async scan(path: string): Promise<DependencyProfile[]> {
    const stat = await Deno.lstat(path);
    const absPath = pathlib.resolve(Deno.cwd(), path);
    if (stat.isDirectory) {
      return new DirectoryScanner().scan(absPath);
    } else if (stat.isFile) {
      return new FileScanner().scan(absPath);
    } else {
      return [];
    }
  }
}
