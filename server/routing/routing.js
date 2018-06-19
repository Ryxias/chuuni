'use strict';

//
// Route index
//   The global route configuration file
//
module.exports = service_container => {

  // Route Registry
  // FIXME Eventually move this file to a compiler pass?
  const { RouteRegistry } = require('express-route-registry');
  const registry = new RouteRegistry();
  registry.setContainer(service_container);

  // Middleware
  const apiRequiresLoggedIn = service_container.get('express.api_requires_logged_in_middleware');
  const gossipApiParameterConverter = service_container.get('express.gossip_api_parameter_converter');
  const requiresGossipMiddleware = service_container.get('express.requires_gossip_middleware');
  const apiErrorHandler = (err, req, res, next) => {
    res.send({
      success: false,
      system_code: '50000000000000',
      message: 'Internal server error.',
      error: err.message,
    });
  };

  // Routes
  registry.routeBuilder({
    '/api': {
      '/sif': {
        '/roll': {
          get: {
            name: 'sif_api_roll',
            service_id: 'SifApiController',
            action: 'get_roll_gacha_action',
          },
        },
        '/share': {
          middleware: [ apiRequiresLoggedIn ],
          post: {
            service_id: 'SifApiController',
            action: 'share_roll_action',
          }
        },
      },
      '/auth': {
        '/login': {
          post: [ 'AuthenticationApiController', 'login_action' ]
        },
        '/logout': {
          middleware: [ apiRequiresLoggedIn ],
          post: [ 'AuthenticationApiController', 'logout_action' ]
        },
        '/whoami': {
          get: [ 'AuthenticationApiController', 'whoami_action' ]
        },
        '/register': {
          post: [ 'AuthenticationApiController', 'register_action' ]
        },
        '/change_password': {
          middleware: [ apiRequiresLoggedIn ],
          post: [ 'AuthenticationApiController', 'change_password_action' ]
        },
        '/slack_token': {
          middleware: [ apiRequiresLoggedIn ],
          post: [ 'AuthenticationApiController', 'request_slack_connector_token_action' ]
        },
      },
      '/gossips': {
        middleware: [ apiRequiresLoggedIn ],
        get: [ 'GossipApiController', 'index_action' ],
        '/:gossip_id(\\d+)': {
          param: [ 'gossip_id', gossipApiParameterConverter ],
          middleware: [ requiresGossipMiddleware ],
          get: [ 'GossipApiController', 'get_single_gossip_action' ],
          patch: [ 'GossipApiController', 'edit_single_gossip_action' ],
          delete: [ 'GossipApiController', 'delete_single_gossip_action' ],
        }
      },
      '/*': {
        get: (req, res, next) => {
          return res.status(404).send({ message: 'Bwuh? Where in the world am I??' });
        }
      },
    },
    error: apiErrorHandler,
  });

  registry.routeBuilder({
    '/_debug/': { // hopefully hard to guess
      '/routes': {
        get: [ 'DebugController', 'get_all_routes_action' ],

        '/match': {
          get: [ 'DebugController', 'get_match_routes_action' ],
        }
      },
    },
  });

  registry.routeBuilder({
    '/helloworld': {
      get: [ 'HelloWorldController', 'index_action' ],
    },
    '/guestbook': {
      get: [ 'HelloWorldController', 'another_action' ],
    },
    '/health': {
      get: [ 'HelloWorldController', 'health_check_action' ],
    },
    '/*': {
      get: [ 'ReactController', 'index_action' ]
    },
  });

  return registry;
};
