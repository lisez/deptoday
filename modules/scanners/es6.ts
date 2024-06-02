import type { DependencyProfile, Scanner } from '../types.ts';

import { InlineScanner } from './inline.ts';

const regex = /(?:import|export|from) ["'](?<source>[^;]+)["'];/gm;

export class Es6FileScanner implements Scanner {
  static guard(path: string): boolean {
    return regex.test(path);
  }

  scan(path: string): Promise<DependencyProfile[]> {
    const paths = [...path.matchAll(regex)].map((m) => m.groups!.source);
    return InlineScanner.Multiple(paths);
  }
}
