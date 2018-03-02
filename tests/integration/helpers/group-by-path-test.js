import { A as emberA } from '@ember/array';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';

moduleForComponent('group-by-path', 'helper:group-by-path', {
  integration: true
});

test('It groups by given single path', function (assert) {
  set(this, 'array', emberA([
    { category: 'A', name: 'a' },
    { category: 'B', name: 'c' },
    { category: 'A', name: 'b' },
    { category: 'B', name: 'd' }
  ]));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), 'AabBcd', 'AabBcd is the right order');
});

test('It groups by given single async path', function (assert) {
  set(this, 'array', RSVP.all(emberA([
    RSVP.resolve({ category: 'A', name: 'a' }),
    RSVP.resolve({ category: 'B', name: 'c' }),
    RSVP.resolve({ category: 'A', name: 'b' }),
    RSVP.resolve({ category: 'B', name: 'd' })
  ])));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), 'AabBcd', 'AabBcd is the right order');
});

test('It groups by given nested path', function (assert) {
  set(this, 'array', emberA([
    { category: { type: 'A' }, name: 'a' },
    { category: { type: 'B' }, name: 'c' },
    { category: { type: 'A' }, name: 'b' },
    { category: { type: 'B' }, name: 'd' }
  ]));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category.type') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), 'AabBcd', 'AabBcd is the right order');
});

test('It groups by given nested async path', function (assert) {
  set(this, 'array', RSVP.all(emberA([
    RSVP.resolve({ category: RSVP.resolve({ type: 'A' }), name: 'a' }),
    RSVP.resolve({ category: RSVP.resolve({ type: 'B' }), name: 'c' }),
    RSVP.resolve({ category: RSVP.resolve({ type: 'A' }), name: 'b' }),
    RSVP.resolve({ category: RSVP.resolve({ type: 'B' }), name: 'd' })
  ])));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category.type') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), 'AabBcd', 'AabBcd is the right order');
});

test('It groups by given integer path', function (assert) {
  set(this, 'array', emberA([
    { category: 1, name: 'a' },
    { category: 2, name: 'c' },
    { category: 1, name: 'b' },
    { category: 2, name: 'd' }
  ]));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), '1ab2cd', '1ab2cd is the right order');
});

test('It groups missing path into unknown category', function (assert) {
  set(this, 'actions', {
    setUnknownGroup(value) {
      return value === undefined ? 'C' : value;
    },
  });

  set(this, 'array', emberA([
    { category: 'A', name: 'a' },
    { name: 'c' },
    { category: 'B', name: 'b' },
    { name: 'd' }
  ]));

  this.render(hbs`
    {{~#each-in (group-by-path array 'category' (action "setUnknownGroup")) as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  assert.equal(this.$().text().trim(), 'AaCcdBb', 'AaCcdBb is the right order');
});

test('It watches for changes', function (assert) {
  const array = emberA([
    { category: 'A', name: 'a' },
    { category: 'B', name: 'c' },
    { category: 'A', name: 'b' },
    { category: 'B', name: 'd' }
  ]);

  set(this, 'array', array);

  this.render(hbs`
    {{~#each-in (group-by-path array 'category') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  run(() => set(array.objectAt(3), 'category', 'C'));

  assert.equal(this.$().text().trim(), 'AabBcCd', 'AabBcCd is the right order');
});

test('It watches for nested changes', function (assert) {
  const array = emberA([
    { category: { type: 'A' }, name: 'a' },
    { category: { type: 'B' }, name: 'c' },
    { category: { type: 'A' }, name: 'b' },
    { category: { type: 'B' }, name: 'd' }
  ]);

  set(this, 'array', array);

  this.render(hbs`
    {{~#each-in (group-by-path array 'category.type') as |category items|~}}
      {{~category~}}
      {{~#each items as |item|~}}{{~item.name~}}{{~/each~}}
    {{~/each-in~}}
  `);

  run(() => set(array.objectAt(3), 'category.type', 'C'));

  assert.equal(this.$().text().trim(), 'AabBcCd', 'AabBcCd is the right order');
});
