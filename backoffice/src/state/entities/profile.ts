/* eslint-disable require-jsdoc */
import { autorun,  observable } from 'mobx'

import StateSession from 'state/entities/session'

import jwtDecode from 'jwt-decode'

export default class StateProfile {
    _id?: string = undefined

    session?: StateSession = undefined

    @observable userName: string = ''

    constructor(session: any, configurationPromise: any) {
        this.session = session;

        configurationPromise.then(() => {
            autorun(() => {
                if (session.token) {
                    try {
                        let decoded : any = jwtDecode(session.token)
                        if (decoded.payload) {
                            this.userName = decoded.payload.name
                        }
                    } catch (ignore) {}
                }
            })
        })
    }
}
