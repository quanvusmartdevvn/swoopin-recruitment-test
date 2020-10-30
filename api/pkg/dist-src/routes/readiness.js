const ReadinessRoute = {
    method: "GET",
    url: "/",
    async handler() {
        return true;
    },
};
export default ReadinessRoute;
