'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var jsYaml = _interopDefault(require('js-yaml'));
var Fastify = _interopDefault(require('fastify'));
var FastifyCors = _interopDefault(require('fastify-cors'));
var FastifyAuth = _interopDefault(require('fastify-auth'));
var FastifyJWT = _interopDefault(require('fastify-jwt'));
var Logger = _interopDefault(require('@harmonyjs/logger'));
var aes256 = _interopDefault(require('aes256'));
var polyline = _interopDefault(require('@mapbox/polyline'));
var turf = _interopDefault(require('@turf/turf'));
var moment = _interopDefault(require('moment'));

function AuthenticationService() {
  const instance = {
    logger: Logger({
      name: 'Authentication',
      configuration: {
        console: true
      }
    }),
    account: null,

    configure(account) {
      this.account = account;
    },

    async authenticateAccount(args) {
      try {
        var _decoded$payload;

        // Decode JSON
        const decoded = await args.req.jwtVerify();

        if (decoded === null || decoded === void 0 ? void 0 : (_decoded$payload = decoded.payload) === null || _decoded$payload === void 0 ? void 0 : _decoded$payload.userId) {
          // Verify account is present
          if (!this.account || decoded.payload.userId === this.account.id) {
            const user = this.account;
            return Object.assign(args.req, {
              user
            });
          }
        } // Error


        return args.res.code(500).send({
          statusCode: 500,
          error: 'Internal Server Error'
        });
      } catch (e) {
        return args.res.code(401).send({
          statusCode: 401,
          error: 'Credentials invalid',
          message: e.message
        });
      }
    }

  };
  return instance;
}

var AuthenticationService$1 = AuthenticationService();

// @ts-ignore

function EncryptionService() {
  const instance = {
    secret: "",

    configure(configuration) {
      this.secret = configuration.secret;
    },

    encryptPassword(args) {
      return aes256.encrypt(this.secret, args.password + args.salt).toString();
    },

    comparePassword(args) {
      return aes256.decrypt(this.secret, args.encrypted) === args.password + args.salt;
    }

  };
  return instance;
}

var EncryptionService$1 = EncryptionService();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const UPDATE_INTERVAL = 1000;
const SPEED_VARIATION = 2;
const TEMPERATURE_VARIATION = 1;

function VehicleService() {
  const instance = {
    logger: Logger({
      name: "Vehicle",
      configuration: {
        console: true
      }
    }),
    vehicles: [],

    configure(vehicles) {
      // Initialize vehicles
      this.initializeVehicles(vehicles); // Update vehicles

      setInterval(() => this.updateVehicles(), UPDATE_INTERVAL);
    },

    initializeVehicles(vehicles) {
      this.vehicles = vehicles.map(vehicle => {
        const coordinates = polyline.decode(vehicle.polyline);
        const line = turf.lineString(coordinates);
        const options = {
          units: "meters"
        };
        const location = turf.along(line, 0, options);
        return _objectSpread2(_objectSpread2({}, vehicle), {}, {
          defaultSpeed: vehicle.speed,
          defaultTemperature: vehicle.temperature,
          location: location.geometry.coordinates,
          line,
          distance: 0
        });
      });
    },

    updateVehicles() {
      this.vehicles.forEach(vehicle => {
        // Update only if vehicle is active
        if (vehicle.online) {
          vehicle.updatedAt = moment().toISOString(); // Update vehicle position

          const options = {
            units: "meters"
          };
          const location = turf.along(vehicle.line, vehicle.distance, options);
          vehicle.location = location.geometry.coordinates; // Increment traveled distance

          const metersTraveled = vehicle.defaultSpeed / 3.6;
          vehicle.distance += metersTraveled; // Reinitialize position at end of route

          const routeLength = turf.length(vehicle.line, {
            units: "meters"
          });

          if (vehicle.distance >= routeLength) {
            vehicle.distance = 0;
          } // Random speed


          const minSpeed = vehicle.defaultSpeed - SPEED_VARIATION;
          const maxSpeed = vehicle.defaultSpeed + SPEED_VARIATION;
          vehicle.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed); // Random temperature

          const minTemp = vehicle.defaultTemperature - TEMPERATURE_VARIATION;
          const maxTemp = vehicle.defaultTemperature + TEMPERATURE_VARIATION;
          vehicle.temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1) + minTemp);
        } else {
          vehicle.speed = 0;
        }
      });
    },

    getDrivers() {
      return this.vehicles;
    },

    updateVehicleStatus(id, status) {
      const idx = this.vehicles.findIndex(i => i.id == id);

      if (idx !== -1) {
        this.vehicles[idx].online = status;
      }
    },

    updateVehicle(id, payload) {
      const idx = this.vehicles.findIndex(i => i.id == id);

      if (idx !== -1) {
        this.vehicles[idx] = _objectSpread2(_objectSpread2({}, this.vehicles[idx]), payload);
      }
    }

  };
  return instance;
}

var VehicleService$1 = VehicleService();

const ReadinessRoute = {
  method: "GET",
  url: "/",

  async handler() {
    return true;
  }

};

const GeneralStatusRoute = {
  method: "GET",
  url: "/general/status",

  async handler() {
    const response = {
      environment: "PRODUCTION",
      status: "OK"
    };
    return response;
  }

};

const GeneralVersionRoute = {
  method: "GET",
  url: "/general/version",

  async handler() {
    const response = {
      buildDate: "17/05/2020 19:00:00 +02:00",
      buildVersion: "1.0.0",
      apiVersion: "v1"
    };
    return response;
  }

};

const logger = Logger({
  name: "AccountLogin",
  configuration: {
    console: true
  }
});

const LoginRoute = async (server, opts, next) => {
  server.route({
    method: "POST",
    url: "/login",

    async handler(req, res) {
      try {
        //validate body login, password here
        if (!req.body || !req.body.login || !req.body.password) {
          throw new Error("wrong_credentials");
        } //get login and password from body


        const {
          login,
          password
        } = req.body; //get db account from server

        const {
          account
        } = req.conf; // check exist db

        if (!account) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        } //verify email


        if (account["email"] != login) {
          return res.code(401).send({
            error: "Bad Request",
            message: "user_not_found"
          });
        } //compare password


        if (!EncryptionService$1.comparePassword({
          password: password,
          salt: account["id"],
          encrypted: account["password"]
        })) {
          return res.code(401).send({
            error: "Bad Request",
            message: "wrong_credentials"
          });
        }

        const payload = {
          userId: account.id,
          name: account.name,
          isAdmin: false
        };
        const token = server.jwt.sign({
          payload
        });
        return res.code(200).send({
          token
        });
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  server.route({
    method: "GET",
    url: "/vehicles",
    preHandler: server.auth([server.authenticateAccount]),

    async handler(req, res) {
      try {
        const data = VehicleService$1.getDrivers();
        return res.code(200).send({
          data
        });
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  server.route({
    method: "POST",
    url: "/vehicles/online/:id_of_vehicle",
    preHandler: server.auth([server.authenticateAccount]),

    async handler(req, res) {
      try {
        VehicleService$1.updateVehicles();
        const vehicles = VehicleService$1.vehicles || [];
        const findIndex = vehicles.findIndex(i => i.id === req.params.id_of_vehicle);

        if (findIndex === -1) {
          throw new Error();
        }

        VehicleService$1.updateVehicleStatus(vehicles[findIndex].id, true);
        return res.code(200).send({});
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  server.route({
    method: "POST",
    url: "/vehicles/offline/:id_of_vehicle",
    preHandler: server.auth([server.authenticateAccount]),

    async handler(req, res) {
      try {
        VehicleService$1.updateVehicles();
        const vehicles = VehicleService$1.vehicles || [];
        const findIndex = vehicles.findIndex(i => i.id === req.params.id_of_vehicle);

        if (findIndex === -1) {
          throw new Error();
        }

        VehicleService$1.updateVehicleStatus(vehicles[findIndex].id, false);
        return res.code(200).send({});
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  server.route({
    method: "PUT",
    url: "/vehicles/plate/:id_of_vehicle",
    preHandler: server.auth([server.authenticateAccount]),

    async handler(req, res) {
      try {
        if (!req.body["plate"]) {
          throw new Error("wrong_credentials");
        }

        VehicleService$1.updateVehicles();
        const vehicles = VehicleService$1.vehicles || [];
        const findIndex = vehicles.findIndex(i => i.id === req.params.id_of_vehicle);

        if (findIndex === -1) {
          throw new Error();
        }

        VehicleService$1.updateVehicle(vehicles[findIndex].id, {
          plate: req.body["plate"]
        });
        return res.code(200).send({});
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  server.route({
    method: "PUT",
    url: "/vehicles/:id_of_vehicle",
    preHandler: server.auth([server.authenticateAccount]),

    async handler(req, res) {
      try {
        if (!req.body) {
          throw new Error("wrong_credentials");
        }

        VehicleService$1.updateVehicles();
        const vehicles = VehicleService$1.vehicles || [];
        const findIndex = vehicles.findIndex(i => i.id === req.params.id_of_vehicle);

        if (findIndex === -1) {
          throw new Error();
        }

        delete req.body.id;
        VehicleService$1.updateVehicle(vehicles[findIndex].id, req.body);
        return res.code(200).send({});
      } catch (error) {
        if (!error.message) {
          return res.code(500).send({
            error: "Internal Server Error"
          });
        }

        return res.code(401).send({
          error: "Bad Request",
          message: error.message
        });
      } // FIXME

    }

  });
  next();
};

async function loadLogger() {
  return Logger({
    name: 'ApplicationImport',
    configuration: {
      console: true
    }
  });
}

async function loadConfiguration(confPath, logger) {
  logger.info('Loading configuration');
  let confAsYaml = null;

  try {
    confAsYaml = fs.readFileSync(confPath, 'utf-8');
  } catch (err) {
    logger.error('Unable to load configuration. Exiting.');
    process.exit(0);
  }

  const conf = jsYaml.safeLoad(confAsYaml);
  logger.info('Configuration loaded');
  return conf.app;
}

async function launchServer(conf, logger) {
  var _conf$encryption, _conf$authentication;

  logger.info('Launching server');
  const server = Fastify();
  server.register(FastifyCors);
  server.register(FastifyAuth);
  server.register(FastifyJWT, {
    secret: (_conf$encryption = conf.encryption) === null || _conf$encryption === void 0 ? void 0 : _conf$encryption.secret,
    sign: {
      algorithm: 'HS512',
      expiresIn: ((_conf$authentication = conf.authentication) === null || _conf$authentication === void 0 ? void 0 : _conf$authentication.expiresIn) ? conf.authentication.expiresIn : '1 hour'
    }
  }); // Readiness endpoint

  server.route(ReadinessRoute); // Mount general endpoints

  server.route(GeneralStatusRoute);
  server.route(GeneralVersionRoute); // Endpoints

  server.register(LoginRoute); // Add conf

  server.decorateRequest('conf', conf); // Authenticate methods

  server.decorate('authenticateAccount', (req, res, done) => AuthenticationService$1.authenticateAccount({
    req,
    res,
    done
  }));
  await server.listen(conf.server.port, conf.server.host);
  logger.info(`Server ready at ${conf.server.host}:${conf.server.port}`);
}

async function run() {
  const logger = await loadLogger();
  const conf = await loadConfiguration(path.resolve('../conf/application.yml'), logger); // Configure services

  if (conf.encryption) {
    EncryptionService$1.configure(conf.encryption);
  }

  if (conf.account) {
    AuthenticationService$1.configure(conf.account);
  }

  if (conf.vehicles) {
    VehicleService$1.configure(conf.vehicles);
  }

  await launchServer(conf, logger);
}

run().catch(err => {
  console.error('Fatal error: ');
  console.error(err);
  process.exit(-1);
});
//# sourceMappingURL=index.js.map
