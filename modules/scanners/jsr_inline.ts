import type { DependencyProfile, Scanner } from '../types.ts';

export class JsrInlineScanner implements Scanner {
  static guard(path: string): boolean {
    return path.startsWith('jsr:');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const p =
      /^jsr:(?:(?<pkg>@.+)@(?<ver>.+)|(?:(?<only_pkg>@[^/]+\/[^/]+)(?:\/.+)?))$/
        .exec(
          path,
        );
    if (!p) return [];
    if (p.groups?.only_pkg) {
      return [
        {
          name: p.groups.only_pkg,
          version: '*',
          modifier: 'jsr',
          provider: 'jsr',
          files: [],
        },
      ];
    }
    return [
      {
        name: p.groups!.pkg,
        version: p.groups!.ver,
        modifier: 'jsr',
        provider: 'jsr',
        files: [],
      },
    ];
  }
}
