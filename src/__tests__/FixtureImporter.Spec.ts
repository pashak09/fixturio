import { Fixture1 } from '@app/__tests__/fixtures/Fixture1';
import { Fixture2 } from '@app/__tests__/fixtures/Fixture2';
import { TestIsNotFixture } from '@app/__tests__/fixtures/TestIsNotFixture';
import { FixtureImporter } from '@app/FixtureImporter';

describe('FixtureImporter', () => {
  it('imports all classes', async () => {
    const instance = new FixtureImporter(['src/__tests__/fixtures/**/**.ts']);

    expect(await instance.import()).toMatchObject([TestIsNotFixture, Fixture2, Fixture1]);
  });

  it('import single file', async () => {
    const instance = new FixtureImporter(['src/__tests__/fixtures/Fixture1.ts']);

    expect(await instance.import()).toMatchObject([Fixture1]);
  });

  it('works with glob pattern', async () => {
    const instance = new FixtureImporter(['src/__tests__/fixtures/*.ts']);

    expect(await instance.import()).toMatchObject([TestIsNotFixture, Fixture2, Fixture1]);
  });
});
