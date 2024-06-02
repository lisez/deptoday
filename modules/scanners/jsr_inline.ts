import type { DependencyProfile, Scanner } from 'modules/types.ts';

export class JsrInlineScanner implements Scanner {
  static guard(path: string): boolean {
    return path.startsWith('jsr:');
  }

  async scan(path: string): Promise<DependencyProfile[]> {
    if (!JsrInlineScanner.guard(path)) return [];

    const p = /^jsr:(@.+)@(.+)$/.exec(path);
    if (!p) return [];
    return [
      {
        name: p[1],
        version: p[2],
        modifier: 'jsr',
        provider: 'jsr',
        files: [],
      },
    ];
  }
}
