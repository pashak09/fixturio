import { FixtureAsserter } from '@app/FixtureAsserter';
import { FixtureConstructor } from '@app/index';
import { ObjectDirector } from '@app/ObjectDirector';

describe('ObjectDirector', () => {
  const fixtureAsserter = new FixtureAsserter();
  const objectDirector = new ObjectDirector(fixtureAsserter);

  describe('getInjectDependencies', () => {
    const assertInjectDependencies = jest.spyOn(fixtureAsserter, 'assertInjectDependencies');

    it('should return the inject dependencies of the fixture', () => {
      const fixture: FixtureConstructor = jest.fn();

      fixture.prototype.getInjectDependencies = jest.fn(() => ['dep1', 'dep2']);

      const result = objectDirector.getInjectDependencies(fixture);

      expect(result).toEqual(['dep1', 'dep2']);
      expect(fixture.prototype.getInjectDependencies).toHaveBeenCalledTimes(1);
      expect(assertInjectDependencies).toHaveBeenCalledTimes(1);
      expect(assertInjectDependencies).toHaveBeenCalledWith(fixture, ['dep1', 'dep2']);
    });

    it('should return an empty array if the fixture does not have getInjectDependencies method', () => {
      const fixture: FixtureConstructor = jest.fn();

      const result = objectDirector.getInjectDependencies(fixture);

      expect(result).toEqual([]);
      expect(fixtureAsserter.assertInjectDependencies).toHaveBeenCalledWith(fixture, []);
      expect(assertInjectDependencies).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTags', () => {
    const assertTags = jest.spyOn(fixtureAsserter, 'assertTags');

    it('should return the tags of the fixture', () => {
      const fixture: FixtureConstructor = jest.fn();

      fixture.prototype.getTags = jest.fn(() => ['tag1', 'tag2']);

      const result = objectDirector.getTags(fixture);

      expect(result).toEqual(['tag1', 'tag2']);
      expect(fixture.prototype.getTags).toHaveBeenCalled();
      expect(assertTags).toHaveBeenCalledWith(fixture, ['tag1', 'tag2']);
      expect(assertTags).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if the fixture does not have getTags method', () => {
      const fixture: FixtureConstructor = jest.fn();
      const result = objectDirector.getTags(fixture);

      expect(result).toEqual([]);
      expect(assertTags).toHaveBeenCalledWith(fixture, []);
      expect(assertTags).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFixtureDependencies', () => {
    const assertFixtureDependencies = jest.spyOn(fixtureAsserter, 'assertFixtureDependencies');

    assertFixtureDependencies.mockImplementation(() => {});

    it('should return the fixture dependencies of the fixture', () => {
      const fixture: FixtureConstructor = jest.fn();

      fixture.prototype.getFixtureDependencies = jest.fn(() => ['depFixture1', 'depFixture2']);

      const result = objectDirector.getFixtureDependencies(fixture);

      expect(result).toEqual(['depFixture1', 'depFixture2']);
      expect(fixture.prototype.getFixtureDependencies).toHaveBeenCalledTimes(1);
      expect(assertFixtureDependencies).toHaveBeenCalledWith(fixture, [
        'depFixture1',
        'depFixture2',
      ]);
      expect(assertFixtureDependencies).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if the fixture does not have getFixtureDependencies method', () => {
      const fixture: FixtureConstructor = jest.fn();

      const result = objectDirector.getFixtureDependencies(fixture);

      expect(result).toEqual([]);
      expect(fixtureAsserter.assertFixtureDependencies).toHaveBeenCalledWith(fixture, []);
      expect(assertFixtureDependencies).toHaveBeenCalledTimes(1);
    });
  });
});
