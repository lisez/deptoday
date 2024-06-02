import type {
  DependencyProvider,
  DependencyRegistryProfile,
} from 'modules/types.ts';

export type JsrResponse = {
  _id: string;
  'dist-tags': {
    latest: string;
  };
  versions: Record<string, unknown>;
};

export class NpmProvider implements DependencyProvider {
  static getUrl(name: string): URL {
    const host = 'https://registry.npmjs.org/';
    return new URL(`/${name}`, host);
  }

  async scan(name: string): Promise<DependencyRegistryProfile> {
    const url = NpmProvider.getUrl(name);
    const resp = await fetch(url);
    if (!resp.ok) {
      return { name, latest: 'unknown', versions: [] };
    }
    const data: JsrResponse = await resp.json();
    return {
      name,
      latest: data['dist-tags'].latest,
      versions: Object.keys(data.versions),
    };
  }
}
