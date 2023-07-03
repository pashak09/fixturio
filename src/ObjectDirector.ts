import { FixtureAsserter } from '@app/FixtureAsserter';
import { FixtureConstructor, InjectDependency } from '@app/index';

export class ObjectDirector {
  constructor(private readonly fixtureAsserter: FixtureAsserter) {}

  getInjectDependencies(fixture: FixtureConstructor): readonly InjectDependency[] {
    const dependencies =
      typeof fixture.prototype.getInjectDependencies === 'function'
        ? fixture.prototype.getInjectDependencies()
        : [];

    this.fixtureAsserter.assertInjectDependencies(fixture, dependencies);

    return dependencies;
  }

  getTags(fixture: FixtureConstructor): readonly string[] {
    const tags: string[] =
      typeof fixture.prototype.getTags === 'function' ? fixture.prototype.getTags() : [];

    this.fixtureAsserter.assertTags(fixture, tags);

    return tags;
  }

  getFixtureDependencies(fixture: FixtureConstructor): readonly FixtureConstructor[] {
    const fixtureDependencies =
      typeof fixture.prototype.getFixtureDependencies === 'function'
        ? fixture.prototype.getFixtureDependencies()
        : [];

    this.fixtureAsserter.assertFixtureDependencies(fixture, fixtureDependencies);

    return fixtureDependencies;
  }
}
