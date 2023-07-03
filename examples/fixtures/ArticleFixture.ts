import {
  DependentFixtureInterface,
  FixtureInterface,
  FixtureBucket,
  DependencyInjectable,
  TaggableInterface,
  InjectDependency,
  FixtureDependency,
} from 'src/index';

import { Article } from '../entity/Article';
import { ObjectSaver } from '../services';

import { UserFixture } from './UserFixture';

type ArticleFixtureResultOf = {
  readonly firstArticle: Article;
  readonly secondArticle: Article;
};

export class ArticleFixture
  implements
    FixtureInterface<ArticleFixtureResultOf>,
    DependentFixtureInterface,
    TaggableInterface,
    DependencyInjectable
{
  constructor(private readonly objectSaver: ObjectSaver) {}

  getTags(): readonly string[] {
    return ['Fixture'];
  }

  getInjectDependencies(): readonly InjectDependency[] {
    return [ObjectSaver];
  }

  getFixtureDependencies(): readonly FixtureDependency[] {
    return [UserFixture];
  }

  async install(fixtureSetupBucket: FixtureBucket): Promise<ArticleFixtureResultOf> {
    const { firstUser, secondUser } = fixtureSetupBucket.fixtureResultOf(UserFixture);

    const firstArticle = new Article(1, firstUser, 'hey');
    const secondArticle = new Article(2, secondUser, 'hey');

    await this.objectSaver.save([firstArticle, secondArticle]);

    return {
      firstArticle,
      secondArticle,
    };
  }
}
