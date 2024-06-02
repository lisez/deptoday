import type { DependencyProfile, Scanner } from 'modules/types.ts';

export class NpmInlineScanner implements Scanner {
  static guard(path: string): boolean {
    return path.startsWith('npm:');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    if (!NpmInlineScanner.guard(path)) return [];

    const p = /^npm:(@?.+)@(.+)$/.exec(path);
    if (!p) return [];
    return [
      {
        name: p[1],
        version: p[2],
        modifier: 'npm',
        provider: 'npm',
        files: [],
      },
    ];
  }
}
