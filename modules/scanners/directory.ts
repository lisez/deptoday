import type { DependencyProfile, Scanner } from "../types.ts";

import { walk } from "jsr:@std/fs/walk";
import { FileScanner } from "./file.ts";

export class DirectoryScanner implements Scanner {
  async scan(path: string): Promise<DependencyProfile[]> {
    const paths: string[] = [];
    for await (const entry of walk(path, {
      exts: ["ts", "json", "lock"],
      skip: [/[\/]node_modules[\/]/],
    })) {
      if (entry.isFile) paths.push(entry.path);
    }

    const profiles = await Promise.all(
      paths.map((p) => new FileScanner().scan(p)),
    );
    return profiles.flat();
  }
}
