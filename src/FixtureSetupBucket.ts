import { FixtureInterface } from '@app/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T> = new (...args: any[]) => T;

export type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export type FixtureResult<FixtureType extends FixtureInterface<unknown>> = UnPromisify<
  ReturnType<FixtureType['install']>
>;

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
