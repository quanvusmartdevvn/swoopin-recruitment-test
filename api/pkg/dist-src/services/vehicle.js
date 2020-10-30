import polyline from "@mapbox/polyline";
import turf from "@turf/turf";
import moment from "moment";
import Logger from "@harmonyjs/logger";
const UPDATE_INTERVAL = 1000;
const SPEED_VARIATION = 2;
const TEMPERATURE_VARIATION = 1;
function VehicleService() {
    const instance = {
        logger: Logger({ name: "Vehicle", configuration: { console: true } }),
        vehicles: [],
        configure(vehicles) {
            // Initialize vehicles
            this.initializeVehicles(vehicles);
            // Update vehicles
            setInterval(() => this.updateVehicles(), UPDATE_INTERVAL);
        },
        initializeVehicles(vehicles) {
            this.vehicles = vehicles.map((vehicle) => {
                const coordinates = polyline.decode(vehicle.polyline);
                const line = turf.lineString(coordinates);
                const options = { units: "meters" };
                const location = turf.along(line, 0, options);
                return {
                    ...vehicle,
                    defaultSpeed: vehicle.speed,
                    defaultTemperature: vehicle.temperature,
                    location: location.geometry.coordinates,
                    line,
                    distance: 0,
                };
            });
        },
        updateVehicles() {
            this.vehicles.forEach((vehicle) => {
                // Update only if vehicle is active
                if (vehicle.online) {
                    vehicle.updatedAt = moment().toISOString();
                    // Update vehicle position
                    const options = { units: "meters" };
                    const location = turf.along(vehicle.line, vehicle.distance, options);
                    vehicle.location = location.geometry.coordinates;
                    // Increment traveled distance
                    const metersTraveled = vehicle.defaultSpeed / 3.6;
                    vehicle.distance += metersTraveled;
                    // Reinitialize position at end of route
                    const routeLength = turf.length(vehicle.line, {
                        units: "meters",
                    });
                    if (vehicle.distance >= routeLength) {
                        vehicle.distance = 0;
                    }
                    // Random speed
                    const minSpeed = vehicle.defaultSpeed - SPEED_VARIATION;
                    const maxSpeed = vehicle.defaultSpeed + SPEED_VARIATION;
                    vehicle.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);
                    // Random temperature
                    const minTemp = vehicle.defaultTemperature - TEMPERATURE_VARIATION;
                    const maxTemp = vehicle.defaultTemperature + TEMPERATURE_VARIATION;
                    vehicle.temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1) + minTemp);
                }
                else {
                    vehicle.speed = 0;
                }
            });
        },
        getDrivers() {
            return this.vehicles;
        },
        updateVehicleStatus(id, status) {
            const idx = this.vehicles.findIndex((i) => i.id == id);
            if (idx !== -1) {
                this.vehicles[idx].online = status;
            }
        },
        updateVehicle(id, payload) {
            const idx = this.vehicles.findIndex((i) => i.id == id);
            if (idx !== -1) {
                this.vehicles[idx] = { ...this.vehicles[idx], ...payload };
            }
        },
    };
    return instance;
}
export default VehicleService();
