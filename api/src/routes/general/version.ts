import { RouteOptions } from "fastify";

const GeneralVersionRoute: RouteOptions = {
    method: "GET",
    url: "/general/version",
    async handler() {
        const response = {
            buildDate: "17/05/2020 19:00:00 +02:00",
            buildVersion: "1.0.0",
            apiVersion: "v1",
        };
        return response;
    },
};

export default GeneralVersionRoute;
