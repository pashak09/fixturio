import { Fixture1 } from '@app/__tests__/fixtures/Fixture1';
import { Fixture2 } from '@app/__tests__/fixtures/Fixture2';
import { TestIsNotFixture } from '@app/__tests__/fixtures/TestIsNotFixture';
import { fixtureSifter } from '@app/fixtureSifter';
import { FixtureConstructor } from '@app/index';

type TestCase = {
  readonly description: string;
  readonly input: readonly unknown[];
  readonly expected: readonly FixtureConstructor[];
};

describe('fixtureSifter', () => {
  const cases: readonly TestCase[] = [
    {
      description: 'should import all fixtures',
      expected: [Fixture1, Fixture2],
      input: [Fixture1, Fixture2],
    },
    {
      description: "should skip class is it's not a fixture",
      expected: [Fixture1, Fixture2],
      input: [Fixture1, Fixture2, TestIsNotFixture],
    },
    {
      description: 'should skip garbage',
      expected: [],
      input: ['', undefined, null, 0, [], {}, () => {}],
    },
  ];

  it.each(cases)('$description', ({ input, expected }: TestCase) => {
    expect(fixtureSifter(input)).toEqual(expected);
  });
});
