import EmberApplication from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Resolver from './resolver';

const App = EmberApplication.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
