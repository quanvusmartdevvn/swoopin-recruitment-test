import StateConfiguration from './utils/configuration'
import StateLayout from './utils/layout'
import StateSession from './entities/session'
import StateProfile from './entities/profile'
import StateVehicles from './entities/vehicles'

class State {
    configuration = new StateConfiguration()

    layout = new StateLayout()

    session = new StateSession(this.configuration)

    profile = new StateProfile(this.session, this.configuration)

    vehicles = new StateVehicles(this.session, this.configuration)
}

const state = new State()

export default state
