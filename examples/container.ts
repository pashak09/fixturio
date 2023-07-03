import { InjectDependency, ServiceContainerInterface } from '@app/index';

import { ObjectSaver } from './services';

export class Container implements ServiceContainerInterface {
  private readonly mapper: Record<string, unknown>;

  constructor() {
    this.mapper = {
      [ObjectSaver.toString()]: new ObjectSaver(),
    };
  }

  getService<TInput = unknown, TResult = TInput>(
    typeOrToken: InjectDependency<TInput> | string
  ): TResult {
    return <TResult>this.mapper[typeOrToken.toString()];
  }
}
