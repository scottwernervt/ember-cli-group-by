import { A as emberA } from '@ember/array';
import Controller from '@ember/controller';
import { set } from '@ember/object';

import { groupByPath } from 'ember-cli-group-by/macros';

export default Controller.extend({
  single: emberA([
    { category: new Date(2018, 3, 7), name: '1' },
    { category: new Date(2018, 11, 23), name: '2' },
    { category: new Date(2011, 5, 1), name: '3' },
    { category: new Date(2011, 11, 23), name: '4' },
    { category: undefined, name: '5' },
  ]),
  singleGroup: groupByPath('single', 'category', function (value) {
    if (value === undefined) {
      return 'Unknown'
    }
    return value.getFullYear();
  }),

  double: emberA([
    { category: { type: 'A' }, name: '1' },
    { category: { type: 'A' }, name: '2' },
    { category: { type: 'B' }, name: '3' },
    { category: { type: 'B' }, name: '4' },
    { category: { type: null }, name: '5' },
  ]),
  doubleGroup: groupByPath('double', 'category.type'),

  actions: {
    director(value) {
      if (value === undefined) {
        return 'Unknown'
      }
      return value.getFullYear();
    },

    addSingleItem() {
      this.get('single').addObject({ category: new Date(2019, 3, 7) , name: '5' });
    },

    addDoubleItem() {
      this.get('double').addObject({ category: { type: 'A' }, name: '5' });
    },

    editItem() {
      const item = this.get('double').filterBy('name', '1')[0];
      set(item, 'category.type', 'C');
    }
  },
});
