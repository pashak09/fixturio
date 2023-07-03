import { cwd } from 'process';

import { FixtureImporter } from '@app/FixtureImporter';
import { FixtureManager } from '@app/FixtureManager';
import { fixtureSifter } from '@app/fixtureSifter';
import {
  FixtureConstructor,
  FixtureImporterInterface,
  FixtureLoadFilters,
  ServiceContainerInterface,
} from '@app/index';

export type FixtureRootOptions = {
  readonly filePatterns: readonly string[];
  readonly serviceContainer?: ServiceContainerInterface | undefined;
};

export class FixtureContainer {
  private readonly importer: FixtureImporterInterface;

  private readonly manager: FixtureManager;

  private fixtures: readonly FixtureConstructor[];

  constructor(
    private readonly options: FixtureRootOptions,
    importer?: FixtureImporterInterface | undefined
  ) {
    this.importer = importer ?? new FixtureImporter(this.options.filePatterns);
    this.manager = new FixtureManager(options.serviceContainer);
    this.fixtures = [];
  }

  async loadFiles(rootDir?: string | undefined): Promise<void> {
    if (this.fixtures.length !== 0) {
      return;
    }

    this.fixtures = fixtureSifter(await this.importer.import(rootDir ?? cwd()));
  }

  async installFixtures(options?: FixtureLoadFilters | undefined): Promise<void> {
    if (this.fixtures.length === 0) {
      throw new Error('Fixture files have not been imported yet');
    }

    await this.manager.loadAll(this.fixtures, options ?? { tags: [] });
  }
}
