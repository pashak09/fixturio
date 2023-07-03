import { FixtureConstructor } from '@app/index';

export function isFixture(obj: unknown): obj is FixtureConstructor {
  return typeof obj === 'function' && typeof obj.prototype?.install === 'function';
}

export function fixtureSifter(objects: readonly unknown[]): readonly FixtureConstructor[] {
  const fixtures: FixtureConstructor[] = [];

  for (const object of objects) {
    if (isFixture(object)) {
      fixtures.push(object);
    }
  }

  return fixtures;
}
