import type { DependencyProfile } from '../types.ts';

import { AnyVersion } from '../constants.ts';

export function aggregate(ary: DependencyProfile[]): DependencyProfile[] {
  ary.sort((a, b) =>
    a.name.localeCompare(b.name) || a.version.localeCompare(b.version) ||
    a.provider.localeCompare(b.provider) ||
    a.modifier.localeCompare(b.modifier) || +!!b.installed - +!!a.installed
  );

  return ary.reduce((acc, cur) => {
    if (acc.length === 0) {
      acc.push(cur);
    } else {
      const last = acc.at(-1)!;

      if (
        last.name == cur.name && last.provider == cur.provider &&
        last.modifier == cur.modifier
      ) {
        if (last.version === cur.version) {
          last.files.push(...cur.files);
        } else if (cur.version === AnyVersion) {
          last.files.push(...cur.files);
        } else if (last.version === AnyVersion) {
          last.version = cur.version;
          last.files.push(...cur.files);
        } else {
          acc.push(cur);
        }
      } else {
        acc.push(cur);
      }

      last.files = Array.from(new Set(last.files));
    }
    return acc;
  }, [] as DependencyProfile[]);
}
