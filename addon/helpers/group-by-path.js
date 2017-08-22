import { A as emberArray, isArray as isEmberArray } from '@ember/array';
import Helper from '@ember/component/helper';
import EmberObject, { computed, defineProperty, get, observer, set } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

/**
 * Group by function that is called by the computed property on the helper.
 *
 * Reference:
 * https://gist.github.com/Asherlc/cc438c9dc13912618b8b
 *
 * @private
 */
const groupBy = function () {
  const byPath = get(this, 'byPath');
  const array = get(this, 'array');
  const missing = get(this, 'missing');

  const paths = byPath.split('.');
  const groups = EmberObject.create({});

  const arrayPromise = RSVP.resolve(array);

  const promise = arrayPromise.then(items =>
    RSVP.all(items.map((item) => {
      const itemGroup = paths.reduce(
        (previous, path) => {
          const previousItem = RSVP.resolve(previous);
          return previousItem.then((nestedItem) => {
            if (isEmpty(nestedItem)) {
              return undefined;
            }
            return get(nestedItem, path);
          });
        }, item);

      const itemGroupPromise = RSVP.resolve(itemGroup);

      return itemGroupPromise.then((groupName) => {
        const groupKey = isEmpty(groupName) ? missing : groupName;
        let group = get(groups, `${groupKey}`); // support non strings

        if (!isEmberArray(group)) {
          group = emberArray();
          groups[`${groupKey}`] = group;
        }

        group.pushObject(item);
      });
    })));

  return PromiseObject.create({
    promise: promise.then(() => groups),
  });
};

/**
 * The group-by-path handlebars helper.
 *
 * Reference:
 * https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/group-by.js
 *
 * @extends Ember.Helper
 */
export default Helper.extend({
  /**
   * Group items in an array by property.
   *
   * @param {string} byPath - Property to group by.
   * @param {Ember.Object[]} array - Items
   * @param {string} [missing] - Default category.
   * @return {Ember.Object} - Grouped items.
   */
  compute([byPath, array, missing] /*, hash */) {
    set(this, 'byPath', byPath);
    set(this, 'array', array);
    set(this, 'missing', missing);

    // TODO: CODE: _nestedX cp does not fire unless it is called at least once.
    Object.keys(this).forEach((property) => {
      if (property.startsWith('_nested')) {
        get(this, property);
      }
    });

    return get(this, 'content');
  },

  /**
   * Watch for changes and update nested computed properties.
   *
   * @private
   */
  paramsDidChanged: observer('byPath', 'missing', 'array.[]', function () {
    const byPath = get(this, 'byPath');

    if (!isEmpty(byPath)) {
      // chain computed properties since they only work one level deep.
      if (byPath.includes('.')) {
        byPath.split('.').forEach((path, index, paths) => {
          if (index === 0) {
            defineProperty(this, `_nested${index}`, computed.mapBy('array', path));
          } else if (index + 1 === paths.length) {
            defineProperty(this, 'content', computed(`_nested${index - 1}.@each.{${path}}`,
              groupBy));
          } else {
            defineProperty(this, `_nested${index}`, computed.mapBy(`_nested${index - 1}`, path));
          }
        });
      } else {
        defineProperty(this, 'content', computed(`array.@each.${byPath}`, groupBy));
      }
    } else {
      defineProperty(this, 'content', null);
    }

    // items added / removed from array
    run.once(this, this.recompute);
  }),

  /**
   * Force recomputation on content change.
   *
   * @private
   */
  contentDidChange: observer('content.[]', function () {
    this.recompute();
  }),
});
