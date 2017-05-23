# ember-cli-group-by

Group by helper that supports async nested properties and assignment of a default category if the
property is missing. It is a drop in replacement for [ember-composable-helpers:group-by](https://github.com/DockYard/ember-composable-helpers#group-by).

```hbs
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

```no-highlight
ember install ember-cli-group-by
```
## Usage

### Basic

```js
export default Ember.Controller.extend({
  shoppingCart: Ember.A([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Tomato', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
  ]),
});
```

```hbs
{{#each-in (group-by-path "category" shoppingCart) as |category products|}}
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

```js
export default Ember.Controller.extend({
  shoppingCart: Ember.A([
    { name: 'Cinnamon ', category: 'Spice' },
    { name: 'Banana', category: 'Fruit' },
    { name: 'Apple', category: 'Fruit' },
    { name: 'Tomato', category: 'Vegetable' },
    { name: 'Broccoli', category: 'Vegetable' },
    { name: 'Salt', category: null },
    { name: 'Sugar' },
  ]),
});
```

```hbs
{{#each-in (group-by-path "category" shoppingCart "Other") as |category products|}}
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
out the example at 
[ember-twiddle](https://ember-twiddle.com/caf15c9b204e04123d6b1e5e7a06ad3a?openFiles=helpers.group-by-path.js%2C).

```js
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
{{#each-in (group-by-path "category.name" user.cart) as |category products|}}
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
{{#each-in (group-by "category" (sort-by "category" "name" shoppingCart)) as |category products|}}
  <h3>{{category}}</h3>
  <ul>
    {{#each products as |product|}}
    	<li>{{product.name}}</li>
    {{/each}}
  </ul>
{{/each-in}}
```
