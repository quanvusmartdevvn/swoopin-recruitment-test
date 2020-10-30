const GeneralStatusRoute = {
    method: "GET",
    url: "/general/status",
    async handler() {
        const response = {
            environment: "PRODUCTION",
            status: "OK",
        };
        return response;
    },
};
export default GeneralStatusRoute;
