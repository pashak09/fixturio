import { FixtureResult, Type } from '@app/FixtureBucket';
import { FixtureInterface } from '@app/index';

export class FixtureSetupBucket {
  private readonly fixtureResultCache: Record<string, unknown> = {};

  fixtureResultOf<T extends FixtureInterface<unknown>>(type: Type<T>): FixtureResult<T> {
    const result = this.fixtureResultCache[type.name];

    if (result !== undefined) {
      return <FixtureResult<T>>result;
    }

    throw new Error(`Cannot load result of fixture ${type.name}`);
  }

  onFixtureResult<T extends FixtureInterface<unknown>>(type: Type<T>, value: unknown): void {
    this.fixtureResultCache[type.name] = value;
  }
}
