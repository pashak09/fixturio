import { join } from 'path';

import { FixtureContainer } from '../src';

import { Container } from './container';

(async (): Promise<void> => {
  const fixtureContainer = new FixtureContainer({
    filePatterns: [join(__dirname, 'fixtures/**/*.ts')],
    serviceContainer: new Container(),
  });

  await fixtureContainer.loadFiles();
  await fixtureContainer.installFixtures();
})();
