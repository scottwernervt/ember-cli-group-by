import { A as emberA, isArray } from '@ember/array';
import EmberObject, { get } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

const PromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

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
  const arrayPromise = RSVP.resolve(array);
  const groupPromise = arrayPromise.then(items => {
    const groups = EmberObject.create({});

    items.map((item) => {
      const groupName = key.split('.').reduce((previous, path) => {
        const itemPromise = RSVP.resolve(previous);
        return itemPromise.then(item => isEmpty(item) ? undefined : get(item, path));
      }, item);

      groupName.then((groupName) => {
        const groupKey = definition ? definition(groupName) : groupName;
        let currentGroup = get(groups, `${groupKey}`);

        if (!isArray(currentGroup)) {
          currentGroup = emberA();
          groups[`${groupKey}`] = currentGroup;
        }

        currentGroup.pushObject(item);
      });
    });

    return groups;
  });

  return PromiseProxy.create({
    promise: groupPromise,
  });
}
