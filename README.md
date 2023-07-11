# fixturio

<p align="center">
  <a href="https://github.com/pashak09/fixturio/actions">
    <img src="https://github.com/pashak09/fixturio/actions/workflows/ci.yml/badge.svg" alt="test" />
  </a>
  <a href="https://coveralls.io/github/pashak09/fixturio?branch=master">
    <img src="https://coveralls.io/repos/github/pashak09/fixturio/badge.svg?branch=master" alt="Coverage Status" />
  </a>
  <a href="https://www.npmjs.com/package/fixturio">
    <img src="https://img.shields.io/npm/v/fixturio" alt="npm shield" />
  </a>
</p>

## Installation

```bash
yarn add -D fixturio
```

Fixturio excels at resolving complex object dependencies. It automatically analyzes the dependencies between objects and
determines the optimal order in which they should be loaded. This library utilizes the duck typing approach. If an
exported class has an install method, it will be marked as a
fixture.

### Inject dependencies

To inject dependencies into the constructor, you need to define the `getInjectDependencies` method in the fixture class
and provide a container that implements the `ServiceContainerInterface` interface. **Note that the order of definition is
important. Dependencies will be injected in the same order they are defined.**

```ts
import {
  FixtureInterface,
  FixtureBucket,
  DependencyInjectable,
  InjectDependency,
} from 'fixturio';

export class ArticleFixture implements FixtureInterface<unknown>, DependencyInjectable {
  constructor(
    //1
    private readonly objectSaver: ObjectSaver,
    //2
    private readonly somethingElse: SomethingElse
  ) {
  }

  getInjectDependencies(): readonly InjectDependency[] {
            //1,             2
    return [ObjectSaver, SomethingElse];
  }

  async install(fixtureBucket: FixtureBucket): Promise<unknown> {
    //...
  }
}

//Container.ts
export class Container implements ServiceContainerInterface {
    private readonly mapper: Record<string, unknown> = {};

    getService<TInput = unknown, TResult = TInput>(
        typeOrToken: InjectDependency<TInput> | string
    ): TResult {
        return <TResult>this.mapper[typeOrToken.toString()];
    }
}

//fixtureLoader.ts
(async (): Promise<void> => {
    const fixtureContainer = new FixtureContainer({
        filePatterns: [join(__dirname, 'fixtures/**/*.ts')],
        serviceContainer: new Container(),
    });

    await fixtureContainer.loadFiles();
    await fixtureContainer.installFixtures();
})();
```

### Dependencies between fixtures

To define dependencies between fixture classes, you need to implement the `getFixtureDependencies` method.

```ts
import {
  FixtureInterface,
  FixtureBucket,
  DependentFixtureInterface,
  InjectDependency,
} from 'fixturio';

//AFixture.ts
export class AFixture implements FixtureInterface<unknown>, DependentFixtureInterface {
  getFixtureDependencies(): readonly FixtureDependency[] {
    return [BFixture];
  }

  async install(fixtureBucket: FixtureBucket): Promise<unknown> {
    //...
  }
}

//BFixture.ts
export class BFixture implements FixtureInterface<unknown> {
  async install(fixtureBucket: FixtureBucket): Promise<unknown> {
    //...
  }
}
```

### Examples

More examples can be found in <a href="https://github.com/pashak09/fixturio/tree/master/examples">examples</a> folder

# License

MIT
