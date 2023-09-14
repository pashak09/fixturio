import { cwd } from 'node:process';

import { FixtureContainer } from '../src';

import { Container } from './container';

(async (): Promise<void> => {
  const fixtureContainer = new FixtureContainer(new Container());

  await fixtureContainer.installFixtures({
    rootDir: cwd(),
    filePatterns: ['fixtures/**/*.ts'],
  });
})();
