import { isFixture } from '@app/fixtureSifter';
import { FixtureConstructor, InjectDependency } from '@app/index';

export class FixtureAsserter {
  assertInjectDependencies(
    fixture: FixtureConstructor,
    injectDependencies: unknown,
  ): asserts injectDependencies is readonly InjectDependency[] {
    this.assertArray(injectDependencies, `Dependencies for ${fixture.name} must be an array`);
    this.assertArrayItem(injectDependencies, (injectDependency: unknown): void => {
      if (typeof injectDependency !== 'function' && typeof injectDependency !== 'string') {
        throw new Error(
          `Unknown fixture inject dependency ${injectDependency} for ${fixture.name}`,
        );
      }
    });
  }

  assertFixtureDependencies(
    fixture: FixtureConstructor,
    fixtureDependencies: unknown,
  ): asserts fixtureDependencies is readonly FixtureConstructor[] {
    this.assertArray(fixtureDependencies, `Dependencies for ${fixture.name} must be an array`);
    this.assertArrayItem(fixtureDependencies, (fixtureDependency: unknown): void => {
      if (isFixture(fixtureDependency) === false) {
        throw new Error(`Unknown fixture dependency ${fixtureDependency} for ${fixture.name}`);
      }
    });
  }

  assertTags(fixture: FixtureConstructor, tags: unknown): asserts tags is readonly string[] {
    this.assertArray(tags, `Tags for ${fixture.name} must be an array`);
    this.assertArrayItem(tags, (tag: unknown): void => {
      if (typeof tag !== 'string') {
        throw new Error(`Unknown tag ${tag} for ${fixture.name}`);
      }
    });
  }

  private assertArray(args: unknown, errorMessage: string): asserts args is unknown[] {
    if (!Array.isArray(args)) {
      throw new Error(errorMessage);
    }
  }

  private assertArrayItem<T>(
    items: readonly unknown[],
    fn: (...args: readonly unknown[]) => void,
  ): asserts items is T[] {
    items.forEach(fn);
  }
}
