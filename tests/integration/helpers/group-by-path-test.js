import { A as emberA } from '@ember/array';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';

module('Integration | Helper | group by path', function (hooks) {
  setupRenderingTest(hooks);

  test('It groups by given single path', async function (assert) {
    this.set('cart', [
      { category: 'A', name: 'a' },
      { category: 'B', name: 'c' },
      { category: 'A', name: 'b' },
      { category: 'B', name: 'd' }
    ]);

    await render(hbs`
      {{~#each-in (group-by-path cart 'category') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('AabBcd', 'AabBcd is the right order');
  });

  test('It groups by given single async path', async function (assert) {
    this.set('cart', RSVP.all([
      RSVP.resolve({ category: 'A', name: 'a' }),
      RSVP.resolve({ category: 'B', name: 'c' }),
      RSVP.resolve({ category: 'A', name: 'b' }),
      RSVP.resolve({ category: 'B', name: 'd' })
    ]));

    await render(hbs`
      {{~#each-in (group-by-path cart 'category') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('AabBcd', 'AabBcd is the right order');
  });

  test('It groups by given nested path', async function (assert) {
    this.set('cart', [
      { category: { type: 'A' }, name: 'a' },
      { category: { type: 'B' }, name: 'c' },
      { category: { type: 'A' }, name: 'b' },
      { category: { type: 'B' }, name: 'd' }
    ]);

    await render(hbs`
      {{~#each-in (group-by-path cart 'category.type') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('AabBcd', 'AabBcd is the right order');
  });

  test('It groups by given nested async path', async function (assert) {
    this.set('cart', RSVP.all([
      RSVP.resolve({ category: RSVP.resolve({ type: 'A' }), name: 'a' }),
      RSVP.resolve({ category: RSVP.resolve({ type: 'B' }), name: 'c' }),
      RSVP.resolve({ category: RSVP.resolve({ type: 'A' }), name: 'b' }),
      RSVP.resolve({ category: RSVP.resolve({ type: 'B' }), name: 'd' })
    ]));

    await render(hbs`
      {{~#each-in (group-by-path cart 'category.type') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('AabBcd', 'AabBcd is the right order');
  });

  test('It groups by given integer path', async function (assert) {
    this.set('cart', [
      { category: 1, name: 'a' },
      { category: 2, name: 'c' },
      { category: 1, name: 'b' },
      { category: 2, name: 'd' }
    ]);

    await render(hbs`
      {{~#each-in (group-by-path cart 'category') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('1ab2cd', '1ab2cd is the right order');
  });

  test('It groups missing path into unknown category', async function (assert) {
    this.set('actions', {
      setUnknownGroup(value) {
        return value === undefined ? 'C' : value;
      },
    });

    this.set('cart', [
      { category: 'A', name: 'a' },
      { name: 'c' },
      { category: 'B', name: 'b' },
      { name: 'd' }
    ]);

    await this.render(hbs`
      {{~#each-in (group-by-path cart 'category' (action "setUnknownGroup")) as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    assert.dom(this.element).hasText('AaCcdBb', 'AaCcdBb is the right order');
  });

  test('It watches for changes', async function (assert) {
    this.set('cart', emberA([
      { category: 'A', name: 'a' },
      { category: 'B', name: 'c' },
      { category: 'A', name: 'b' },
      { category: 'B', name: 'd' }
    ]));

    await render(hbs`
      {{~#each-in (group-by-path cart 'category') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    run(() => {
      const product = this.get('cart').objectAt(3);
      set(product, 'category', 'C');
    });

    assert.dom(this.element).hasText('AabBcCd', 'AabBcCd is the right order');
  });

  test('It watches for nested changes', async function (assert) {
    this.set('cart', emberA([
      { category: { type: 'A' }, name: 'a' },
      { category: { type: 'B' }, name: 'c' },
      { category: { type: 'A' }, name: 'b' },
      { category: { type: 'B' }, name: 'd' }
    ]));

    await render(hbs`
      {{~#each-in (group-by-path cart 'category.type') as |category products|~}}
        {{~category~}}
        {{~#each products as |product|~}}{{~product.name~}}{{~/each~}}
      {{~/each-in~}}
    `);

    run(() => {
      const product = this.get('cart').objectAt(3);
      set(product, 'category.type', 'C');
    });

    assert.dom(this.element).hasText('AabBcCd', 'AabBcCd is the right order');
  });
});
