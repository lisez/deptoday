import * as pathlib from "jsr:@std/path";

import { DependencyProfile, Scanner } from "../types.ts";
import { DirectoryScanner } from "./directory.ts";
import { FileScanner } from "./file.ts";

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
