import { DependencyProfile, DependencyRegistryProfile } from 'modules/types.ts';

export class Agent implements DependencyProfile, DependencyRegistryProfile {
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

