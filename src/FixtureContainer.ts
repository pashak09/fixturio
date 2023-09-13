import { FixtureImporter } from '@app/FixtureImporter';
import { FixtureManager, LoadAllResult } from '@app/FixtureManager';
import { fixtureSifter } from '@app/fixtureSifter';
import { FixtureImporterInterface, ServiceContainerInterface } from '@app/index';

export type FixtureLoadFilters = {
  readonly rootDir: string;
  readonly filePatterns: readonly string[];
  readonly tags?: readonly string[] | undefined;
};

export class FixtureContainer {
  private readonly importer: FixtureImporterInterface;

  private readonly manager: FixtureManager;

  constructor(
    serviceContainer?: ServiceContainerInterface | undefined,
    importer?: FixtureImporterInterface | undefined
  ) {
    this.importer = importer ?? new FixtureImporter();
    this.manager = new FixtureManager(serviceContainer);
  }

  async installFixtures(options: FixtureLoadFilters): Promise<LoadAllResult> {
    return this.manager.loadAll(
      fixtureSifter(await this.importer.import(options.rootDir, options.filePatterns)),
      options.tags ?? []
    );
  }
}
