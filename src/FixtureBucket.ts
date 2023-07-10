import { FixtureSetupBucket } from '@app/FixtureSetupBucket';
import { FixtureInterface } from '@app/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T> = new (...args: any[]) => T;

export type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export type FixtureResult<FixtureType extends FixtureInterface<unknown>> = UnPromisify<
  ReturnType<FixtureType['install']>
>;

export class FixtureBucket {
  constructor(private readonly fixtureSetupBucket: FixtureSetupBucket) {}

  fixtureResultOf<T extends FixtureInterface<unknown>>(type: Type<T>): FixtureResult<T> {
    return this.fixtureSetupBucket.fixtureResultOf(type);
  }
}
