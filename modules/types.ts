export type DependencyProfile = {
  name: string;
  version: string;
  modifier: string;
  provider: string;
  files: string[];
};

export type DependencyRegistryProfile = {
  name: string;
  latest: string;
  versions: string[];
};

export type Scanner = {
  scan(path: string): Promise<DependencyProfile[]>;
};

export type ScannerGuard = (path: string) => boolean;

export type DependencyProvider = {
  scan(name: string): Promise<DependencyRegistryProfile>;
};
