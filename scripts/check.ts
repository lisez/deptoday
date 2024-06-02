import { delay } from 'jsr:@std/async';

import { DependencyRegistryProfile } from '../modules/types.ts';
import { PathScanner } from '../modules/scanners/path.ts';
import { Agent } from '../modules/agent.ts';
import { aggregate } from '../modules/helpers/aggregate.ts';

const config = {
  delay: +(parseInt(Deno.env.get('DELAY') || '', 10) || 50),
};

async function main(args: string[]) {
  const profiles = await Promise.all(
    args.map((arg) => new PathScanner().scan(arg)),
  ).then((p) => p.flat()).then(aggregate);

  const registryProfiles = new Map<string, DependencyRegistryProfile>();
  for (const p of profiles) {
    const key = `${p.provider}:${p.name}`;
    if (registryProfiles.has(key)) continue;
    const profile = await Agent.fetch(p);
    registryProfiles.set(key, profile);

    // INFO: Prevent rate limiting
    await delay(config.delay);
  }

  const data: Record<string, unknown> = profiles
    .filter(
      (p) =>
        registryProfiles.get(`${p.provider}:${p.name}`)?.latest !== p.version,
    )
    .map((p) => {
      const latest = registryProfiles.get(`${p.provider}:${p.name}`)?.latest ??
        'unknown';
      return {
        name: p.name,
        version: p.version,
        latest: latest,
        provider: p.provider,
      };
    })
    .reduce(
      (y, x) => {
        y[x.name] = {
          Provider: x.provider,
          Version: x.version,
          Latest: x.latest,
        };
        return y;
      },
      {} as Record<string, unknown>,
    );
  console.table(data);
}

if (Deno.args.length === 0) {
  console.error('Usage: deno run scripts/check.ts <paths...>');
  Deno.exit(1);
} else {
  await main(Deno.args);
}
