/* group-by-path helper
 *
 * References:
 * https://gist.github.com/Asherlc/cc438c9dc13912618b8b
 * https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/group-by.js
 * */
import Ember from 'ember';
import DS from 'ember-data';

const {
  A,
  isArray,
  isEmpty,
  defineProperty,
  get,
  observer,
  set,
  Helper,
  RSVP,
  computed,
} = Ember;

const {
  PromiseObject,
} = DS;

const groupBy = function () {
  const groups = Ember.Object.create({});
  const byPath = get(this, 'byPath');
  const array = get(this, 'array');
  const missing = get(this, 'missing');
  const paths = byPath.split('.');

  const promises = RSVP.resolve(array).then((items) => {
    return RSVP.all(items.map((item) => {
      const itemGroup = paths.reduce(
        (previous, path) => {
          const previousItem = RSVP.resolve(previous);
          return previousItem.then(nestedItem => get(nestedItem, path));
        }, item);

      return RSVP.resolve(itemGroup).then((groupName) => {
        const groupKey = isEmpty(groupName) ? missing : groupName;
        let group = get(groups, `${groupKey}`); // support non strings

        if (!isArray(group)) {
          group = A();
          groups[`${groupKey}`] = group;
        }

        group.pushObject(item);
      });
    }));
  });

  return PromiseObject.create({
    promise: promises.then(() => groups),
  });
};

export default Helper.extend({
  compute([byPath, array, missing]) {
    set(this, 'array', array);
    set(this, 'byPath', byPath);
    set(this, 'missing', missing);
    return get(this, 'content');
  },

  // eslint-disable-next-line ember/no-observers
  paramsDidChanged: observer('byPath', 'defaultGroup', 'array.[]', function () {
    const byPath = get(this, 'byPath');
    if (!isEmpty(byPath)) {
      if (byPath.includes('.')) { // nested path: item.pathA.pathX
        byPath.split('.').forEach((path, index, paths) => {
          // Dependent keys containing @each only work one level deep.
          if (index === 0) {
            defineProperty(this, `_nested${index}`, computed.mapBy('array', path));
          } else if (index + 1 === paths.length) {
            defineProperty(this, 'content', computed(`_nested${index - 1}.@each.{${path}}`,
              groupBy));
          } else {
            defineProperty(this, `_nested${index}`, computed.mapBy(`_nested${index - 1}`, path));
          }
        });
      } else { // single path: item.pathX
        defineProperty(this, 'content', computed(`array.@each.${byPath}`, groupBy));
      }
    } else {
      defineProperty(this, 'content', null);
    }

    // items added / removed from array
    this.recompute();
  }),

  // eslint-disable-next-line ember/no-observers
  contentDidChange: observer('content.[]', function () {
    this.recompute();
  }),
});
