import groupBy from 'dummy/utils/group-by';
import { module, setupTest, test } from 'qunit';

module('Unit | Utility | group by', function (hooks) {
  setupTest(hooks);

  test('It returns an empty object if array is empty', function (assert) {
    const group = groupBy([], '');
    assert.equal(typeof group, 'object');
  });

  test('It returns a promise proxy', async function (assert) {
    const group = groupBy([], '');
    const proxy = await group;
    assert.ok(proxy.get('isFulfilled'));
  });
});
