import { DependencyInjectable, FixtureInterface, InjectDependency } from 'src/index';

import { User } from '../entity/User';
import { ObjectSaver } from '../services';

type UserFixtureResultOf = {
  readonly firstUser: User;
  readonly secondUser: User;
};

export class UserFixture implements FixtureInterface<UserFixtureResultOf>, DependencyInjectable {
  constructor(private readonly objectSaver: ObjectSaver) {}

  getInjectDependencies(): readonly InjectDependency[] {
    return [ObjectSaver];
  }

  async install(): Promise<UserFixtureResultOf> {
    const firstUser = new User(0, 'user_1');
    const secondUser = new User(0, 'user_2');

    await this.objectSaver.save([firstUser, secondUser]);

    return {
      firstUser,
      secondUser,
    };
  }
}
