import { resolve } from 'path';
import { cwd } from 'process';

import { FixtureImporterInterface } from '@app/index';
import { glob } from 'glob';

export class FixtureImporter implements FixtureImporterInterface {
  constructor(private readonly patterns: readonly string[]) {}

  async import(rootDir?: string | undefined): Promise<readonly unknown[]> {
    const files = await this.matchGlob(rootDir ?? cwd());
    const imported = await Promise.all(
      files.map(
        async (path: string): Promise<readonly string[]> => Object.values(await import(path))
      )
    );

    return imported.flat();
  }

  private async matchGlob(rootDir: string): Promise<string[]> {
    return glob(
      this.patterns.map((pattern: string) => resolve(rootDir, pattern)),
      {
        windowsPathsNoEscape: true,
      }
    );
  }
}
