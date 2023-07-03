import { Fixture1 } from '@app/__tests__/fixtures/Fixture1';
import { Fixture2 } from '@app/__tests__/fixtures/Fixture2';
import { FixtureOrderResolver } from '@app/FixtureOrderResolver';
import { FixtureConstructor } from '@app/index';
import { ObjectDirector } from '@app/ObjectDirector';

describe('FixtureOrderResolver', () => {
  const fixture1 = Fixture1;
  const fixture2 = Fixture2;
  const fixtures: readonly FixtureConstructor[] = [fixture1, fixture2];
  const objectDirectorMock: ObjectDirector = Object.create(ObjectDirector.prototype);
  const getFixtureDependencies = jest.spyOn(objectDirectorMock, 'getFixtureDependencies');

  getFixtureDependencies.mockImplementation(
    (constructor: FixtureConstructor): FixtureConstructor[] => {
      if (constructor === fixture1) {
        return [fixture2];
      }

      return [];
    }
  );

  const fixtureOrderResolver = new FixtureOrderResolver(objectDirectorMock);

  describe('resolveLoadOrder', () => {
    it('should resolve the load order of fixtures', () => {
      const expectedOrder = ['Fixture2', 'Fixture1'];

      expect(fixtureOrderResolver.resolveLoadOrder(fixtures)).toEqual(expectedOrder);
    });
  });

  describe('buildFixtureMap', () => {
    it('should build a map of fixtures', () => {
      const expectedMap = {
        Fixture1: fixture1,
        Fixture2: fixture2,
      };

      expect(fixtureOrderResolver.buildFixtureMap(fixtures)).toEqual(expectedMap);
    });
  });
});
