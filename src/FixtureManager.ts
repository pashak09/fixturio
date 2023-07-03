import { FixtureAsserter } from '@app/FixtureAsserter';
import { FixtureBucket } from '@app/FixtureBucket';
import { FixtureOrderResolver } from '@app/FixtureOrderResolver';
import { FixtureSetupBucket } from '@app/FixtureSetupBucket';
import {
  FixtureConstructor,
  FixtureLoadFilters,
  InjectDependency,
  SaveOnTagsMathFn,
  ServiceContainerInterface,
} from '@app/index';
import { ObjectDirector } from '@app/ObjectDirector';

export class FixtureManager {
  private readonly fixtureSetupBucket: FixtureSetupBucket;

  private readonly fixtureBucket: FixtureBucket;

  private readonly objectDirector: ObjectDirector;

  private readonly fixtureOrderResolver: FixtureOrderResolver;

  constructor(private readonly serviceContainer?: ServiceContainerInterface | undefined) {
    this.fixtureSetupBucket = new FixtureSetupBucket();
    this.fixtureBucket = new FixtureBucket(this.fixtureSetupBucket);
    this.objectDirector = new ObjectDirector(new FixtureAsserter());
    this.fixtureOrderResolver = new FixtureOrderResolver(this.objectDirector);
  }

  async loadAll(
    constructors: readonly FixtureConstructor[],
    options: FixtureLoadFilters
  ): Promise<void> {
    const fixtureMap = this.fixtureOrderResolver.buildFixtureMap(constructors);

    for (const fixtureClassName of this.fixtureOrderResolver.resolveLoadOrder(constructors)) {
      const fixture = fixtureMap[fixtureClassName];

      if (fixture === undefined) {
        throw new Error(`Cannot load fixture ${fixtureClassName}`);
      }

      const instance = new fixture(...this.injectDependencies(fixture));
      const fixturesTags = this.objectDirector.getTags(fixture);

      this.fixtureSetupBucket.onFixtureResult(
        fixture,
        await instance.install(this.fixtureBucket, {
          saveOnTagMath: async (fn: SaveOnTagsMathFn): Promise<void> => {
            if (
              fixturesTags.length > 0 &&
              options.tags.some((tag: string): boolean => fixturesTags.indexOf(tag) >= 0)
            ) {
              await fn();
            }
          },
        })
      );
    }
  }

  private injectDependencies(fixture: FixtureConstructor): readonly unknown[] {
    return this.objectDirector
      .getInjectDependencies(fixture)
      .map((injectDependency: InjectDependency) => {
        if (this.serviceContainer === undefined) {
          throw new Error(
            `Could not inject ${injectDependency}. You did you provide a serviceContainer?`
          );
        }

        const foundInjectDependency = this.serviceContainer.getService(injectDependency);

        if (foundInjectDependency === undefined) {
          throw new Error(
            `Could not find ${injectDependency}. Did you forget to add ${injectDependency} to your serviceContainer?`
          );
        }

        return foundInjectDependency;
      });
  }
}
