import { FixtureResult, FixtureSetupBucket, Type } from '@app/FixtureSetupBucket';
import { FixtureInterface } from '@app/index';

export class FixtureBucket {
  constructor(private readonly fixtureSetupBucket: FixtureSetupBucket) {}

  fixtureResultOf<T extends FixtureInterface<unknown>>(type: Type<T>): FixtureResult<T> {
    return this.fixtureSetupBucket.fixtureResultOf(type);
  }
}
