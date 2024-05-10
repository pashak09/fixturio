import { cwd } from 'node:process';

import { Fixture1 } from '@app/__tests__/fixtures/Fixture1';
import { Fixture2 } from '@app/__tests__/fixtures/Fixture2';
import { TestIsNotFixture } from '@app/__tests__/fixtures/TestIsNotFixture';
import { FixtureImporter } from '@app/FixtureImporter';

describe('FixtureImporter', () => {
  const rootFolder = cwd();

  it('imports all classes', async () => {
    const instance = new FixtureImporter();

    expect(await instance.import(rootFolder, ['src/__tests__/fixtures/**/**.ts'])).toMatchObject([
      TestIsNotFixture,
      Fixture2,
      Fixture1,
    ]);
  });

  it('import single file', async () => {
    const instance = new FixtureImporter();

    expect(await instance.import(rootFolder, ['src/__tests__/fixtures/Fixture1.ts'])).toMatchObject(
      [Fixture1],
    );
  });

  it('works with glob pattern', async () => {
    const instance = new FixtureImporter();

    expect(await instance.import(rootFolder, ['src/__tests__/fixtures/*.ts'])).toMatchObject([
      TestIsNotFixture,
      Fixture2,
      Fixture1,
    ]);
  });
});
