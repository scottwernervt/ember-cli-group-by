import { A as emberA } from '@ember/array';
import groupBy from 'dummy/utils/group-by';
import { module, test } from 'qunit';

module('Unit | Utility | group by');

test('It returns an empty object if array is empty', function (assert) {
  let group = groupBy(emberA(), '');
  assert.equal(typeof group, 'object');
});


test('It returns a promise proxy', function (assert) {
  let group = groupBy(emberA(), '');
  return group.then(function () {
    assert.ok(group.get('isFulfilled'));
  });
});
