import { dependencyResolver } from '@app/dependencyResolver';

type T = {
  readonly key: string;
  readonly dependencies: readonly string[];
};

type TestCase = {
  readonly description: string;
  readonly input: readonly T[];
};

describe('dependencyResolver', () => {
  const cases: readonly TestCase[] = [
    {
      description: 'detects referencing self - small',
      input: [{ key: 'test1', dependencies: ['test1'] }],
    },
    {
      description: 'detects referencing self - large',
      input: [
        { key: 'test1', dependencies: ['test2'] },
        { key: 'test2', dependencies: ['test2'] },
        { key: 'test3', dependencies: [] },
      ],
    },
    {
      description: 'detects circular dependency - small',
      input: [
        { key: 'test1', dependencies: ['test2'] },
        { key: 'test2', dependencies: ['test1'] },
      ],
    },
    {
      description: 'detects circular dependency - large',
      input: [
        { key: 'test5', dependencies: ['test4'] },
        { key: 'test4', dependencies: ['test3'] },
        { key: 'test1', dependencies: ['test2'] },
        { key: 'test2', dependencies: ['test3'] },
        { key: 'test3', dependencies: ['test1'] },
      ],
    },
    {
      description: 'throws when dependency does not exist',
      input: [
        { key: 'test1', dependencies: ['test2'] },
        { key: 'test2', dependencies: ['test3'] },
      ],
    },
    {
      description: 'throws if duplicate key exists',
      input: [
        { key: '1', dependencies: [] },
        { key: '1', dependencies: [] },
      ],
    },
    {
      description: 'throws if dependencies are not unique',
      input: [
        { key: '1', dependencies: ['2', '2'] },
        { key: '2', dependencies: [] },
      ],
    },
  ];

  it.each(cases)('$description', ({ input }: TestCase) => {
    expect(() => dependencyResolver(input)).toThrow(Error);
  });

  it('correctly resolves dependencies', () => {
    const testCase = [
      { key: '1', dependencies: [] },
      { key: '2', dependencies: ['1'] },
      { key: '3', dependencies: ['1'] },
      { key: '4', dependencies: ['1', '7'] },
      { key: '5', dependencies: ['2', '3'] },
      { key: '6', dependencies: ['3'] },
      { key: '7', dependencies: ['6'] },
    ];
    const result = [...dependencyResolver(testCase)];

    for (const item of testCase) {
      for (const dep of item.dependencies) {
        expect(result.indexOf(item.key)).toBeGreaterThan(result.indexOf(dep));
      }
    }

    expect(result.sort()).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });
});
