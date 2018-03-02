import { isArray } from '@ember/array';
import EmberObject, { computed, defineProperty, get } from '@ember/object';
import ComputedProperty from '@ember/object/computed';
import { addObserver, removeObserver } from '@ember/object/observers';
import { camelize } from '@ember/string';
import groupBy from '../utils/group-by';

/**
 * Groups the array by nested async properties.
 *
 * @method groupByPath
 * @static
 * @param {String} dependentKey
 * @param {String} propertyPath
 * @param {Function} groupDefinition
 * @return {ComputedProperty} The grouped object.
 * @public
 */
export function groupByPath(dependentKey, propertyPath, groupDefinition) {
  let cp = new ComputedProperty(function (key) {
    // Add/remove property observers as required.
    let activeObserversMap = cp._activeObserverMap || (cp._activeObserverMap = new WeakMap());
    let activeObservers = activeObserversMap.get(this);

    if (activeObservers !== undefined) {
      activeObservers.forEach(args => removeObserver(...args));
    }

    function groupPropertyDidChange() {
      this.notifyPropertyChange(key);
    }

    // Unique computed property name so they do not overwrite each other.
    let chain = '_' + camelize(
      `chain_${dependentKey.replace('.', ' ')}_${propertyPath.replace('.', ' ')}`
    );

    // Chain computed properties since @each only works one level deep.
    propertyPath.split('.').forEach((path, index, paths) => {
      if (index === 0) {
        defineProperty(this, `${chain}${index}`, computed.mapBy(dependentKey, path));
        get(this, `${chain}${index}`);
      } else if (index + 1 === paths.length) {
        addObserver(this, `${chain}${index - 1}.@each.${path}`, groupPropertyDidChange);
        activeObserversMap.set(this,
          [[this, `${chain}${index - 1}.@each.${path}`, groupPropertyDidChange]]);
      } else {
        defineProperty(this, `${chain}${index}`, computed.mapBy(`${chain}${index - 1}`, path));
        get(this, `${chain}${index}`);
      }
    });

    let itemsKeyIsAtThis = (dependentKey === '@this');
    let items = itemsKeyIsAtThis ? this : get(this, dependentKey);

    if (!isArray(items)) {
      return EmberObject.create({});
    }

    return groupBy(items, propertyPath, groupDefinition);
  }, { dependentKeys: [`${dependentKey}.[]`], readOnly: true });

  cp._activeObserverMap = undefined;

  return cp;
}
