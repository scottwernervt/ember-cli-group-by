import { A as emberA } from '@ember/array';
import EmberObject from '@ember/object';
import { groupByPath } from 'ember-cli-group-by/macros';
import { module, skip, test } from 'ember-qunit';

module('Unit | Macro | group by path', {
  unit: true,
});

const TestSingle = EmberObject.extend({
  array: null,
  singleGroup: groupByPath('array', 'category'),
});

test('It groups by given single path', function (assert) {
  const subject = TestSingle.create({
    array: emberA([
      { name: '1', category: 'A', },
      { name: '2', category: 'A', },
      { name: '3', category: 'B', },
      { name: '4', category: 'B', },
    ]),
  });
  return subject.get('singleGroup').then((grouped) => {
    assert.deepEqual(Object.keys(grouped), ['A', 'B']);
  });
});

const TestNested = EmberObject.extend({
  array: null,
  doubleGroup: groupByPath('array', 'category.type'),
});

skip('It groups by given nested path', function (assert) {
  const subject = TestNested.create({
    array: emberA([
      { name: '1', category: { type: 'A' }, },
      { name: '2', category: { type: 'A' }, },
      { name: '3', category: { type: 'B' }, },
      { name: '4', category: { type: 'B' }, },
    ]),
  });
  return subject.get('doubleGroup').then((grouped) => {
    assert.deepEqual(Object.keys(grouped), ['A', 'B']);
  });
});
