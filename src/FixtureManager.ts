import { FixtureAsserter } from '@app/FixtureAsserter';
import { FixtureBucket } from '@app/FixtureBucket';
import { FixtureLoadFilters } from '@app/FixtureContainer';
import { FixtureOrderResolver } from '@app/FixtureOrderResolver';
import { FixtureSetupBucket } from '@app/FixtureSetupBucket';
import {
  FixtureConstructor,
  InjectDependency,
  SaveOnTagsMathFn,
  ServiceContainerInterface,
} from '@app/index';
import { ObjectDirector } from '@app/ObjectDirector';

export type LoadAllResult = {
  readonly fixtureBucket: FixtureBucket;
  readonly loadedResults: readonly unknown[];
};

export class FixtureManager {
  private readonly objectDirector: ObjectDirector;

  private readonly fixtureOrderResolver: FixtureOrderResolver;

  constructor(private readonly serviceContainer?: ServiceContainerInterface | undefined) {
    this.objectDirector = new ObjectDirector(new FixtureAsserter());
    this.fixtureOrderResolver = new FixtureOrderResolver(this.objectDirector);
  }

  async loadAll(
    constructors: readonly FixtureConstructor[],
    options: FixtureLoadFilters
  ): Promise<LoadAllResult> {
    const fixtureSetupBucket = new FixtureSetupBucket();
    const fixtureBucket = new FixtureBucket(fixtureSetupBucket);
    const fixtureMap = this.fixtureOrderResolver.buildFixtureMap(constructors);
    const loadedResults: unknown[] = [];

    for (const fixtureClassName of this.fixtureOrderResolver.resolveLoadOrder(constructors)) {
      const fixture = fixtureMap[fixtureClassName];

      if (fixture === undefined) {
        throw new Error(`Cannot load fixture ${fixtureClassName}`);
      }

      const instance = new fixture(...this.injectDependencies(fixture));
      const fixturesTags = this.objectDirector.getTags(fixture);
      const installResult = await instance.install(fixtureBucket, {
        saveOnTagMath: async (fn: SaveOnTagsMathFn): Promise<void> => {
          if (
            fixturesTags.length > 0 &&
            options.tags.some((tag: string): boolean => fixturesTags.indexOf(tag) >= 0)
          ) {
            await fn();
            loadedResults.push(installResult);
          }
        },
      });

      if (fixturesTags.length === 0) {
        loadedResults.push(installResult);
      }

      fixtureSetupBucket.onFixtureResult(fixture, installResult);
    }

    return { fixtureBucket, loadedResults };
  }

  private injectDependencies(fixture: FixtureConstructor): readonly unknown[] {
    return this.objectDirector
      .getInjectDependencies(fixture)
      .map((injectDependency: InjectDependency) => {
        if (this.serviceContainer === undefined) {
          throw new Error(
            `Could not inject ${injectDependency}. You did you provide a serviceContainer ?`
          );
        }

        const foundInjectDependency = this.serviceContainer.getService(injectDependency);

        if (foundInjectDependency === undefined) {
          throw new Error(
            `Could not find ${injectDependency}. Did you forget to add ${injectDependency} to your serviceContainer ?`
          );
        }

        return foundInjectDependency;
      });
  }
}
