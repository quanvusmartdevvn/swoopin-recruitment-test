// eslint-disable-next-line no-unused-vars
import { RouteOptions } from "fastify";

const ReadinessRoute: RouteOptions = {
    method: "GET",
    url: "/",
    async handler() {
        return true;
    },
};

export default ReadinessRoute;
