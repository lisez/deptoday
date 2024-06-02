import { DependencyProfile } from '../types.ts';

export function intersect(
  right: DependencyProfile[],
  left: DependencyProfile[],
): DependencyProfile[] {
  return right.filter((e) =>
    !left.find((a) =>
      a.name === e.name && a.version === e.version &&
      a.provider === e.provider && a.modifier === e.modifier
    )
  );
}
