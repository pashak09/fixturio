import { resolve } from 'node:path';

import { FixtureImporterInterface } from '@app/index';
import { glob } from 'glob';

export class FixtureImporter implements FixtureImporterInterface {
  async import(rootDir: string, filePatterns: readonly string[]): Promise<readonly unknown[]> {
    const files = await this.matchGlob(rootDir, filePatterns);
    const imported = await Promise.all(
      files.map(
        async (path: string): Promise<readonly string[]> => Object.values(await import(path))
      )
    );

    return imported.flat();
  }

  private async matchGlob(rootDir: string, filePatterns: readonly string[]): Promise<string[]> {
    return glob(
      filePatterns.map((pattern: string) => resolve(rootDir, pattern)),
      {
        windowsPathsNoEscape: true,
      }
    );
  }
}
