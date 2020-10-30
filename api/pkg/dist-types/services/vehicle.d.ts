declare const _default: {
    logger: import("@harmonyjs/logger").ILogger;
    vehicles: any[];
    configure(vehicles: any): void;
    initializeVehicles(vehicles: any[]): void;
    updateVehicles(): void;
    getDrivers(): any[];
    updateVehicleStatus(id: String, status: boolean): void;
    updateVehicle(id: String, payload: any): void;
};
export default _default;
