import type {
  DependencyProvider,
  DependencyRegistryProfile,
} from 'modules/types.ts';

export type DenolandResponse = {
  latest: string;
  versions: string[];
};

export class DenolandProvider implements DependencyProvider {
  static getUrl(name: string): URL {
    const host = 'https://cdn.deno.land/';
    return new URL(`/${name}/meta/version.json`, host);
  }

  async scan(name: string): Promise<DependencyRegistryProfile> {
    const url = DenolandProvider.getUrl(name);
    const resp = await fetch(url);
    if (!resp.ok) {
      return { name, latest: 'unknown', versions: [] };
    }
    const data: DenolandResponse = await resp.json();
    return {
      name,
      latest: data.latest,
      versions: data.versions,
    };
  }
}
