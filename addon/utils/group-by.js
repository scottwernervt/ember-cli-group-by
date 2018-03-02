import { A as emberA, isArray } from '@ember/array';
import EmberObject, { get } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

const PromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

/**
 *  Helper to get the group's key name.
 *
 * @method getGroupKey
 * @param {String} value
 * @param {Function} getter
 * @returns {*} The group key.
 * @private
 */
function getGroupKey(value, getter) {
  if (getter) {
    return getter(value);
  }

  return value;
}

/**
 * Groups the array by nested properties helper for computed property and helper.
 *
 * References: https://gist.github.com/Asherlc/cc438c9dc13912618b8b
 *
 * @method groupBy
 * @static
 * @param array {Array}
 * @param key {String}
 * @param definition {Function}
 * @public
 */
export default function groupBy(array, key, definition) {
  const paths = key.split('.');
  const groups = EmberObject.create({});
  const arrayPromise = RSVP.resolve(array);

  const groupPromise = arrayPromise.then(items =>
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

      return RSVP.resolve(itemGroup).then((groupName) => {
        const groupKey = getGroupKey(groupName, definition);
        let currentGroup = get(groups, `${groupKey}`); // support non strings

        if (!isArray(currentGroup)) {
          currentGroup = emberA();
          groups[`${groupKey}`] = currentGroup;
        }

        currentGroup.pushObject(item);
      });
    })));

  return PromiseProxy.create({
    promise: groupPromise.then(() => groups),
  });
}
