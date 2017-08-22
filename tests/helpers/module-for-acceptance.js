/* eslint-disable */
import { module } from 'qunit';
import { Promise } from 'rsvp';
import destroyApp from '../helpers/destroy-app';
import startApp from '../helpers/start-app';

export default function (name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    }
  });
}
