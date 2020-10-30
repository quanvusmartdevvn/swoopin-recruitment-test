import VehicleService from '../services/vehicle'
import Logger from "@harmonyjs/logger";
import EncryptionService from '../services/encryption'
const logger = Logger({
    name: "AccountLogin",
    configuration: {
        console: true,
    },
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
                }
                //get login and password from body
                const { login, password } = req.body;
                //get db account from server
                const { account } = req.conf;
                // check exist db
                if (!account) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                //verify email
                if (account["email"] != login) {
                    return res.code(401).send({
                        error: "Bad Request",
                        message: "user_not_found",
                    });
                }
                //compare password
                if (!EncryptionService.comparePassword({
                    password: password,
                    salt: account["id"],
                    encrypted: account["password"],
                })) {
                    return res.code(401).send({
                        error: "Bad Request",
                        message: "wrong_credentials",
                    });
                }
                const payload = {
                    userId: account.id,
                    name: account.name,
                    isAdmin: false,
                };
                const token = server.jwt.sign({ payload });
                return res.code(200).send({ token });
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
    });
    server.route({
        method: "GET",
        url: "/vehicles",
        preHandler: server.auth([server.authenticateAccount]),
        async handler(req, res) {
            try {
                const data = VehicleService.getDrivers();
                return res.code(200).send({ data });
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
    });
    server.route({
        method: "POST",
        url: "/vehicles/online/:id_of_vehicle",
        preHandler: server.auth([server.authenticateAccount]),
        async handler(req, res) {
            try {
                VehicleService.updateVehicles();
                const vehicles = VehicleService.vehicles || [];
                const findIndex = vehicles.findIndex((i) => i.id === req.params.id_of_vehicle);
                if (findIndex === -1) {
                    throw new Error();
                }
                VehicleService.updateVehicleStatus(vehicles[findIndex].id, true);
                return res.code(200).send({});
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
    });
    server.route({
        method: "POST",
        url: "/vehicles/offline/:id_of_vehicle",
        preHandler: server.auth([server.authenticateAccount]),
        async handler(req, res) {
            try {
                VehicleService.updateVehicles();
                const vehicles = VehicleService.vehicles || [];
                const findIndex = vehicles.findIndex((i) => i.id === req.params.id_of_vehicle);
                if (findIndex === -1) {
                    throw new Error();
                }
                VehicleService.updateVehicleStatus(vehicles[findIndex].id, false);
                return res.code(200).send({});
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
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
                VehicleService.updateVehicles();
                const vehicles = VehicleService.vehicles || [];
                const findIndex = vehicles.findIndex((i) => i.id === req.params.id_of_vehicle);
                if (findIndex === -1) {
                    throw new Error();
                }
                VehicleService.updateVehicle(vehicles[findIndex].id, {
                    plate: req.body["plate"],
                });
                return res.code(200).send({});
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
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
                VehicleService.updateVehicles();
                const vehicles = VehicleService.vehicles || [];
                const findIndex = vehicles.findIndex((i) => i.id === req.params.id_of_vehicle);
                if (findIndex === -1) {
                    throw new Error();
                }
                delete req.body.id;
                VehicleService.updateVehicle(vehicles[findIndex].id, req.body);
                return res.code(200).send({});
            }
            catch (error) {
                if (!error.message) {
                    return res
                        .code(500)
                        .send({ error: "Internal Server Error" });
                }
                return res
                    .code(401)
                    .send({ error: "Bad Request", message: error.message });
            }
            // FIXME
        },
    });
    next();
};
export default LoginRoute;
