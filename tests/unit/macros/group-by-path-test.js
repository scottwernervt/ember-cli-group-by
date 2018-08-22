import EmberObject from '@ember/object';
import { groupByPath } from 'ember-cli-group-by/macros';
import { module, setupTest, test } from 'ember-qunit';

module('Unit | Macro | group by path', function (hooks) {
  setupTest(hooks);

  const TestSingle = EmberObject.extend({
    items: undefined,
    grouped: groupByPath('items', 'category'),
  });

  test('It groups by given single path', async function (assert) {
    const subject = TestSingle.create({
      items: [
        { name: '1', category: 'A', },
        { name: '2', category: 'A', },
        { name: '3', category: 'B', },
        { name: '4', category: 'B', },
      ],
    });
    const grouped = await subject.get('grouped');
    const keys = Object.keys(grouped);

    assert.deepEqual(keys, ['A', 'B']);
  });

  const TestNested = EmberObject.extend({
    items: undefined,
    grouped: groupByPath('items', 'category.type'),
  });

  test('It groups by given nested path', async function (assert) {
    const subject = TestNested.create({
      items: [
        { name: '1', category: { type: 'A' }, },
        { name: '2', category: { type: 'A' }, },
        { name: '3', category: { type: 'B' }, },
        { name: '4', category: { type: 'B' }, },
      ],
    });
    const grouped = await subject.get('grouped');
    const keys = Object.keys(await grouped);

    assert.deepEqual(keys, ['A', 'B']);
  });
});
