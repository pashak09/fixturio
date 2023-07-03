import { FixtureAsserter } from '@app/FixtureAsserter';
import { FixtureConstructor } from '@app/index';

type NegativeTestCase = {
  readonly description: string;
  readonly input: unknown;
};

describe('FixtureAsserter', () => {
  const fixtureAsserter = new FixtureAsserter();
  const fixture = class {
    async install(): Promise<readonly []> {
      return [];
    }
  };

  describe('assertInjectDependencies', () => {
    const negativeTestCases: readonly NegativeTestCase[] = [
      {
        description: 'throws an error when injectDependencies is not an array',
        input: undefined,
      },
      {
        description: 'throws an error when an unknown inject dependency is encountered',
        input: [1],
      },
      {
        description: 'throws an error when injectDependencies is a string',
        input: 'not an array',
      },
      {
        description: 'throws an error when injectDependencies is a number',
        input: 123,
      },
      {
        description: 'throws an error when injectDependencies is an object',
        input: { key: 'value' },
      },
      {
        description: 'throws an error when an unknown tag is provided(array of garbage)',
        input: [class {}, 'valid', 1, undefined],
      },
    ];

    it.each(negativeTestCases)('$description', ({ input }: NegativeTestCase) => {
      expect(() => fixtureAsserter.assertInjectDependencies(fixture, input)).toThrow(Error);
    });

    it('does not throw an error when injectDependencies is a valid array', () => {
      expect(() =>
        fixtureAsserter.assertInjectDependencies(fixture, ['Test', class {}])
      ).not.toThrow();
    });
  });

  describe('assertFixtureDependencies', () => {
    const negativeTestCases: readonly NegativeTestCase[] = [
      {
        description: 'throws an error when fixtureDependencies is not an array',
        input: undefined,
      },
      {
        description: 'throws an error when an unknown fixture dependency is encountered',
        input: [1],
      },
      {
        description: 'throws an error when fixtureDependencies is a string',
        input: 'not an array',
      },
      {
        description: 'throws an error when fixtureDependencies is a number',
        input: 123,
      },
      {
        description: 'throws an error when fixtureDependencies is an object',
        input: { key: 'value' },
      },
      {
        description: 'throws an error when an array of garbage is provided',
        input: [
          class {
            async install(): Promise<readonly []> {
              return [];
            }
          },
          'invalid',
        ],
      },
    ];

    it.each(negativeTestCases)('$description', ({ input }: NegativeTestCase) => {
      expect(() => fixtureAsserter.assertFixtureDependencies(fixture, input)).toThrow(Error);
    });

    it('does not throw an error when fixtureDependencies is a valid array', () => {
      const fixtureDependencies: FixtureConstructor[] = [
        class {
          async install(): Promise<readonly []> {
            return [];
          }
        },
      ];

      expect(() =>
        fixtureAsserter.assertFixtureDependencies(fixture, fixtureDependencies)
      ).not.toThrow();
    });
  });

  describe('assertTags', () => {
    const negativeTestCases: readonly NegativeTestCase[] = [
      {
        description: 'throws an error when tags is not an array',
        input: undefined,
      },
      {
        description: 'throws an error when an unknown tag is provided(number)',
        input: [1],
      },
      {
        description: 'throws an error when an unknown tag is provided(undefined)',
        input: [undefined],
      },
      {
        description: 'throws an error when an array of garbage is provided',
        input: ['valid-tag', undefined],
      },
    ];

    it.each(negativeTestCases)('$description', ({ input }: NegativeTestCase) => {
      expect(() => fixtureAsserter.assertTags(fixture, input)).toThrow(Error);
    });

    it('does not throw an error when a valid array of tags are provided', () => {
      expect(() => fixtureAsserter.assertTags(fixture, ['tag1'])).not.toThrow();
    });
  });
});
