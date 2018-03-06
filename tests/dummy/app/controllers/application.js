import { A as emberA } from '@ember/array';
import Controller from '@ember/controller';
import { set } from '@ember/object';

import { groupByPath } from 'ember-cli-group-by/macros';


export default Controller.extend({
  single: emberA([
    { name: '1', category: new Date(2018, 3, 7), },
    { name: '2', category: new Date(2018, 11, 23), },
    { name: '3', category: new Date(2011, 5, 1), },
    { name: '4', category: new Date(2011, 11, 23), },
    { name: '5', category: undefined, },
  ]),
  singleGroup: groupByPath('single', 'category', function (value) {
    if (value === undefined) {
      return 'Unknown'
    }
    return value.getFullYear();
  }),

  double: emberA([
    { name: '1', category: { type: 'A' }, },
    { name: '2', category: { type: 'A' }, },
    { name: '3', category: { type: 'B' }, },
    { name: '4', category: { type: 'B' }, },
    { name: '5', category: { type: null }, },
  ]),
  doubleGroup: groupByPath('double', 'category.type'),

  actions: {
    toYear(value) {
      if (value === undefined) {
        return 'Unknown'
      }
      return value.getFullYear();
    },
  },
});
