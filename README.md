# ember-cli-group-by

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]
[![TravisCI Build Status][travis-badge]][travis-badge-url]
[![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]
[![Code Climate][codeclimate-badge]][codeclimate-badge-url]
[![Dependencies][dependencies-badge]][dependencies-badge-url] 
[![Dev Dependencies][devDependencies-badge]][devDependencies-badge-url]

[npm-badge]: https://img.shields.io/npm/v/ember-cli-group-by.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-cli-group-by
[travis-badge]: https://img.shields.io/travis/scottwernervt/ember-cli-group-by/master.svg
[travis-badge-url]: https://travis-ci.org/scottwernervt/ember-cli-group-by
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/24b82ae0cd54584332e2/maintainability
[codeclimate-badge-url]: https://codeclimate.com/github/scottwernervt/ember-cli-group-by
[ember-observer-badge]: http://emberobserver.com/badges/ember-cli-group-by.svg
[ember-observer-badge-url]: http://emberobserver.com/addons/ember-cli-group-by
[license-badge]: https://img.shields.io/npm/l/ember-cli-group-by.svg
[license-badge-url]: LICENSE.md
[dependencies-badge]: https://david-dm.org/scottwernervt/ember-cli-group-by.svg
[dependencies-badge-url]: https://david-dm.org/scottwernervt/ember-cli-group-by
[devDependencies-badge]: https://david-dm.org/scottwernervt/ember-cli-group-by.svg?type=dev
[devDependencies-badge-url]: https://david-dm.org/scottwernervt/ember-cli-group-by?type=dev

Group by computed property and helper that supports aysnc nested properties.

```javascript
import Controller from '@ember/controller';
import { groupByPath } from 'ember-cli-group-by/macros';

export default Controller.extend({
  arrayGrouped: groupByPath('array', 'nested.property'),
});
```

```handlebars
{{#each-in (group-by-path array "nested.property") as |category items|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each items as |item|}}
    	<li>{{item.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```

## Installation

Requires Ember 2.10 or higher, see 
[Issue #2](https://github.com/scottwernervt/ember-cli-group-by/issues/2).

```no-highlight
ember install ember-cli-group-by
```
## Usage

### Basic

**Computed property**

```javascript
import Controller from '@ember/controller';
import { A as emberA } from '@ember/array';
import { groupByPath } from 'ember-cli-group-by/macros';

export default Controller.extend({
  cart: emberA([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
  ]),
  cartGrouped: groupByPath('cart', 'category'),
});
```

```handlebars
{{#each-in cartGrouped as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```

**Handlebars helper**

```javascript
import Controller from '@ember/controller';
import { A as emberA } from '@ember/array';

export default Controller.extend({
  cart: emberA([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
  ]),
});
```

```handlebars
{{#each-in (group-by-path cart "category") as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```

### Default Category

The group name for an item can be overridden by implementing a computed property function or by 
passing a closure action to the helper.

**Computed property**

```javascript
import Controller from '@ember/controller';
import { A as emberA } from '@ember/array';
import { isNone } from '@ember/utils';
import { groupByPath } from 'ember-cli-group-by/macros';

export default Controller.extend({
  cart: emberA([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
    { name: 'Salt', category: null },
    { name: 'Sugar' },
  ]),
  cartGrouped: groupByPath('cart', 'category', function (value) {
    return isNone(value) ? 'Other' :  value;
  }),
});
```

**Handlebars helper**

```javascript
import Controller from '@ember/controller';
import { A as emberA } from '@ember/array';
import { isNone } from '@ember/utils';

export default Controller.extend({
  cart: emberA([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
    { name: 'Salt', category: null },
    { name: 'Sugar' },
  ]),
  
  actions: {
    defaultCategory(value) {
      return isNone(value) ? 'Other' :  value;
    },
  },
});
```

```handlebars
{{#each-in (group-by-path cart "category" (action "defaultCategory")) as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```

### Async Relationship Property

The group by property can be a nested `belongsTo` relationship that is loaded asynchronously. Check 
out the example at [ember-twiddle](https://ember-twiddle.com/caf15c9b204e04123d6b1e5e7a06ad3a).

```javascript
// models/user.js
export default Model.extend({
  fullname: attr('string'),
  
  cart: hasMany('product', { inverse: 'shopper' }),
});

// models/product.js
export default Model.extend({
  name: attr('string'),
  
  category: belongsTo('category'),
  shopper: belongsTo('user', { inverse: 'cart' }),
});

// models/category.js
export default Model.extend({
  name: attr('string'),
});
```

**Computed property**

```javascript
import Controller from '@ember/controller';
import { isNone } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { groupByPath } from 'ember-cli-group-by/macros';

export default Controller.extend({
  user: alias('model'),
  cart: alias('user.cart'),
  
  cartGrouped: groupByPath('cart', 'category', function (value) {
    return isNone(value) ? 'Other' :  value;
  }),
});
```
