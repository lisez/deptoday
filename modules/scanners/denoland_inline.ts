import type { DependencyProfile, Scanner } from '../types.ts';

export class DenolandInlineScanner implements Scanner {
  static guard(path: string): boolean {
    return path.startsWith('https://deno.land/');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    const url = URL.parse(path);
    if (!url) return [];
    const p = url.pathname.match(
      /^\/(?:x\/)?(?:(?<pkg>.+)@(?<ver>[^/\s]+)|(?<only_pkg>[^/\s]+))/,
    );
    if (p?.groups?.only_pkg) {
      return [
        {
          name: p.groups.only_pkg,
          version: 'latest',
          modifier: 'https',
          provider: 'denoland',
          files: [],
        },
      ];
    }

    return [
      {
        name: p!.groups!.pkg,
        version: p!.groups!.ver,
        modifier: 'https',
        provider: 'denoland',
        files: [],
      },
    ];
  }
}
