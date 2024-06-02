import type {
  DependencyProvider,
  DependencyRegistryProfile,
} from 'modules/types.ts';

export type JsrResponse = {
  scope: string;
  name: string;
  latest: string;
  versions: Record<string, string>;
};

export class JsrProvider implements DependencyProvider {
  static getUrl(name: string): URL {
    const host = 'https://jsr.io';
    return new URL(`/${name}/meta.json`, host);
  }

  async scan(name: string): Promise<DependencyRegistryProfile> {
    const url = JsrProvider.getUrl(name);
    const resp = await fetch(url);
    if (!resp.ok) {
      return { name, latest: 'unknown', versions: [] };
    }

    const data: JsrResponse = await resp.json();
    return { name, latest: data.latest, versions: Object.keys(data.versions) };
  }
}

