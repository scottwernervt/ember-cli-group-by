import groupBy from 'dummy/utils/group-by';
import { module, setupTest, test } from 'ember-qunit';

module('Unit | Utility | group by', function (hooks) {
  setupTest(hooks);

  test('It returns a promise proxy', function (assert) {
    const group = groupBy([], '');
    return group.then(function () {
      assert.equal(group.get('isFulfilled'), true);
    });
  });

  test('It returns an empty object if array is empty', function (assert) {
    const group = groupBy([], '');
    assert.equal(typeof group, 'object');
  });
});
