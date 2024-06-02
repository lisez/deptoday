import type { DependencyProfile, Scanner } from 'modules/types.ts';

export class DenolandInlineScanner implements Scanner {
  static guard(path: string): boolean {
    return path.startsWith('https://deno.land/');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    if (!DenolandInlineScanner.guard(path)) return [];
    const url = URL.parse(path);
    if (!url) return [];
    const p = url.pathname.match(/^\/(?:x\/)?(.+)@(.+)\/$/);
    return [
      {
        name: p![1],
        version: p![2],
        modifier: 'https',
        provider: 'denoland',
        files: [],
      },
    ];
  }
}
