import type {
  DependencyProfile,
  DependencyProvider,
  DependencyRegistryProfile,
} from 'modules/types.ts';

import { JsrProvider } from 'modules/providers/jsr.ts';
import { NpmProvider } from 'modules/providers/npm.ts';
import { DenolandProvider } from 'modules/providers/denoland.ts';

export class Agent implements DependencyProfile, DependencyRegistryProfile {
  static providers: Record<string, DependencyProvider> = {
    npm: new NpmProvider(),
    jsr: new JsrProvider(),
    denoland: new DenolandProvider(),
  };

  static async fetch(p: DependencyProfile): Promise<Agent> {
    const provider = Agent.providers[p.provider];
    if (!provider) {
      return new Agent(p, { name: p.name, latest: 'unknown', versions: [] });
    }
    const registryProfile = await provider.scan(p.name);
    return new Agent(p, registryProfile);
  }

  public readonly name: string;
  public readonly version: string;
  public readonly latest: string;
  public readonly versions: string[];
  public readonly modifier: string;
  public readonly provider: string;
  public readonly files: string[];

  constructor(
    packages: DependencyProfile,
    registry: DependencyRegistryProfile,
  ) {
    this.name = packages.name;
    this.version = packages.version;
    this.latest = registry.latest;
    this.versions = registry.versions;
    this.modifier = packages.modifier;
    this.provider = packages.provider;
    this.files = packages.files;
  }
}
