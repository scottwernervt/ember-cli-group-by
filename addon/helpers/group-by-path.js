/* group-by-path helper
 *
 * References:
 * https://gist.github.com/Asherlc/cc438c9dc13912618b8b
 * https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/group-by.js
 * */
import Ember from 'ember';

const {
  A,
  isArray,
  isEmpty,
  get,
  observer,
  set,
  ObjectProxy,
  PromiseProxyMixin,
  Helper,
  RSVP,
  defineProperty,
  computed,
  run,
} = Ember;

const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

const groupBy = function () {
  const byPath = get(this, 'byPath');
  const array = get(this, 'array');
  const missing = get(this, 'missing');

  const paths = byPath.split('.');
  const groups = Ember.Object.create({});

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

        if (!isArray(group)) {
          group = A();
          groups[`${groupKey}`] = group;
        }

        group.pushObject(item);
      });
    })));

  return PromiseObject.create({
    promise: promise.then(() => groups),
  });
};

export default Helper.extend({
  compute([byPath, array, missing]) {
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

  // eslint-disable-next-line ember/no-observers
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

  // eslint-disable-next-line ember/no-observers
  contentDidChange: observer('content.[]', function () {
    this.recompute();
  }),
});
