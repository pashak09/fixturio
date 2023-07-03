import { Fixture1 } from '@app/__tests__/fixtures/Fixture1';
import { FixtureSetupBucket } from '@app/FixtureSetupBucket';

describe('FixtureSetupBucket', () => {
  let bucket: FixtureSetupBucket;

  beforeEach(() => {
    bucket = new FixtureSetupBucket();
  });

  it('stores fixture result in the bucket', () => {
    bucket.onFixtureResult(Fixture1, ['hello']);
    const result = bucket.fixtureResultOf(Fixture1);

    expect(result).toStrictEqual(['hello']);
  });

  it('throws an error when fixture result does not exist in the cache', () => {
    expect(() => {
      bucket.fixtureResultOf(Fixture1);
    }).toThrow(new Error(`Cannot load result of fixture ${Fixture1.name}`));
  });

  it('overrides existing fixture result in the cache', () => {
    const result1 = 'result 1';
    const result2 = 'result 2';

    bucket.onFixtureResult(Fixture1, result1);
    bucket.onFixtureResult(Fixture1, result2);

    expect(bucket.fixtureResultOf(Fixture1)).toBe(result2);
  });
});
