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

Group by helper that supports async nested properties and assignment of a default category if the
property is missing. It is a drop in replacement for 
[ember-composable-helpers:group-by](https://github.com/DockYard/ember-composable-helpers#group-by).

```handlebars
{{#each-in (group-by-path "property" array "Missing Category") as |category items|}}
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

```javascript
export default Ember.Controller.extend({
  cart: Ember.A([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
  ]),
});
```

```handlebars
{{#each-in (group-by-path "category" cart) as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```
### Default Category

A default category can be set as the 3rd parameter passed to `group-by-path`. Any item that is missing the `category` property or its property is `undefined` or `null` will be grouped into this category.

```javascript
export default Ember.Controller.extend({
  cart: Ember.A([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Lettuce', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
    { name: 'Salt', category: null },
    { name: 'Sugar' },
  ]),
});
```

```handlebars
{{#each-in (group-by-path "category" cart "Other") as |category products|}}
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

```handlebars
{{#each-in (group-by-path "category.name" user.cart "Other") as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```

### Extra

The helper can be used with [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers):

```handlebars
{{#each-in (group-by-path "category" (sort-by "category" "name" cart)) as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```
