import { deprecate } from '@ember/application/deprecations';
import Helper from '@ember/component/helper';
import { computed, defineProperty, get, observer, set } from '@ember/object';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import groupBy from '../utils/group-by';

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
   * On parameter changes, trigger a re-group-by update.
   *
   * @private
   */
  paramsDidChanged: observer('array.[]', 'propertyPath', 'groupDefinition', function () {
    const array = get(this, 'array');
    const propertyPath = get(this, 'propertyPath');
    const groupDefinition = get(this, 'groupDefinition');

    function groupPropertyDidChange() {
      return groupBy(array, propertyPath, groupDefinition);
    }

    if (isEmpty(propertyPath)) {
      defineProperty(this, 'content', null);
    } else {
      // Chain computed properties since @each only works one level deep.
      if (propertyPath.includes('.')) {
        propertyPath.split('.').forEach((path, index, paths) => {
          if (index === 0) {
            defineProperty(this, `_chain_${index}`, computed.mapBy('array', path));
          } else if (index + 1 === paths.length) {
            defineProperty(this, 'content', computed(`_chain_${index - 1}.@each.{${path}}`,
              groupPropertyDidChange));
          } else {
            defineProperty(this, `_chain_${index}`, computed.mapBy(`_chain_${index - 1}`, path));
          }
        });
      } else {
        defineProperty(this, 'content', computed(`array.@each.${propertyPath}`,
          groupPropertyDidChange));
      }
    }

    run.once(this, this.recompute);
  }),

  /**
   * Force re-computation on content change.
   *
   * @private
   */
  contentDidChange: observer('content.[]', function () {
    this.recompute();
  }),

  /**
   * Groups the array by nested async properties.
   *
   * @param {Array} array
   * @param {String} propertyPath
   * @param {Function} groupDefinition
   * @return {Ember.Object} - The grouped object.
   */
  compute([array, propertyPath, groupDefinition]) {
    deprecate('First parameter should be an array followed by the property key.',
      typeof array !== 'string', {
        id: 'ember-cli-group-by.order-parameter',
        until: '0.0.6',
      });

    deprecate('The parameter missing has been removed. Use an action to set the default group.',
      typeof groupDefinition !== 'string', {
        id: 'ember-cli-group-by.remove-missing',
        until: '0.0.6',
      });

    set(this, 'array', array);
    set(this, 'propertyPath', propertyPath);
    set(this, 'groupDefinition', groupDefinition);

    Object.keys(this).forEach((property) => {
      if (property.startsWith('_chain')) {
        get(this, property);
      }
    });

    return get(this, 'content');
  },
});
