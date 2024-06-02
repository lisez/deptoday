import { delay } from 'jsr:@std/async';

import { DependencyRegistryProfile } from 'modules/types.ts';
import { JsrProvider } from 'modules/providers/jsr.ts';
import { NpmProvider } from 'modules/providers/npm.ts';
import { PathScanner } from 'modules/scanners/path.ts';

async function main(args: string[]) {
  const profiles = await Promise.all(
    args.map((arg) => new PathScanner().scan(arg)),
  ).then((p) => p.flat());

  const registryProfiles = new Map<string, DependencyRegistryProfile>();
  for (const p of profiles) {
    const key = `${p.provider}:${p.name}`;
    if (registryProfiles.has(key)) continue;
    switch (p.provider) {
      case 'npm': {
        const provider = new NpmProvider();
        const registryProfile = await provider.scan(p.name);
        registryProfiles.set(key, registryProfile);
        break;
      }
      case 'jsr': {
        const provider = new JsrProvider();
        const registryProfile = await provider.scan(p.name);
        registryProfiles.set(key, registryProfile);
        break;
      }
      default:
        break;
    }

    // INFO: Prevent rate limiting
    await delay(100);
  }

  const data: Record<string, unknown> = profiles.map((p) => {
    const latest = registryProfiles.get(`${p.provider}:${p.name}`)?.latest ??
      'unknown';
    return { Name: p.name, Version: p.version, Latest: latest };
  }).reduce((y, x) => {
    y[x.Name] = { Version: x.Version, Latest: x.Latest };
    return y;
  }, {} as Record<string, unknown>);
  console.table(data);
}

if (Deno.args.length === 0) {
  console.error('Usage: deno run check.ts <directory>');
  Deno.exit(1);
} else {
  await main(Deno.args);
}
