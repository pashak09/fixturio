import { DependencyNode, dependencyResolver } from '@app/dependencyResolver';
import { FixtureConstructor } from '@app/index';
import { ObjectDirector } from '@app/ObjectDirector';

type BuildDependencyNode = {
  readonly dependencies: readonly string[];
  readonly key: string;
};

export class FixtureOrderResolver {
  constructor(private readonly objectDirector: ObjectDirector) {}

  resolveLoadOrder(constructors: readonly FixtureConstructor[]): readonly string[] {
    return dependencyResolver(this.buildDependencyNode(constructors));
  }

  buildFixtureMap(constructors: readonly FixtureConstructor[]): Record<string, FixtureConstructor> {
    const result: Record<string, FixtureConstructor> = {};

    for (const constructor of constructors) {
      result[constructor.name] = constructor;
    }

    return result;
  }

  private buildDependencyNode(
    constructors: readonly FixtureConstructor[]
  ): readonly DependencyNode[] {
    return constructors.map((item: FixtureConstructor): BuildDependencyNode => {
      return {
        dependencies: this.objectDirector
          .getFixtureDependencies(item)
          .map((dep: FixtureConstructor) => dep.name),
        key: item.name,
      };
    });
  }
}
