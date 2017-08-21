/* eslint-env node */
module.exports = {
  scenarios: [
    // LTS fail, see bug #2.
    // {
    //   name: 'ember-lts-2.4',
    //   bower: {
    //     dependencies: {
    //       'ember': 'components/ember#lts-2-4'
    //     },
    //     resolutions: {
    //       'ember': 'lts-2-4'
    //     }
    //   },
    //   npm: {
    //     devDependencies: {
    //       'ember-source': null,
    //       'ember-data': '2.9.0'
    //     }
    //   }
    // },
    // {
    //   name: 'ember-lts-2.8',
    //   bower: {
    //     dependencies: {
    //       'ember': 'components/ember#lts-2-8'
    //     },
    //     resolutions: {
    //       'ember': 'lts-2-8'
    //     }
    //   },
    //   npm: {
    //     devDependencies: {
    //       'ember-source': null
    //     }
    //   }
    // },
    {
      name: 'ember-2.10',
      bower: {
        dependencies: {
          'ember': 'components/ember#2.10.2'
        },
        resolutions: {
          'ember': '2.10'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.12',
      bower: {
        dependencies: {
          'ember': 'components/ember#2.12.2'
        },
        resolutions: {
          'ember': '2.12.2'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        },
        resolutions: {
          'ember': 'release'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        },
        resolutions: {
          'ember': 'canary'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
