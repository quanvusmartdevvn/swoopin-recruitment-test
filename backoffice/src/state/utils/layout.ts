/* eslint-disable require-jsdoc */
import {
    observable,
} from 'mobx'

import { IconMenuHome } from 'resources/icons'

export default class StateLayout {
    default : {
        topBar: {
            titleIcon?: React.ComponentType<{ className?: string }>,
            title?: string | React.ReactNode,
            left?: {
                type?: string,
                onClick?: Function | null,
                to?: string | null,
                state?: Object | null,
                component?: React.ComponentType | null,
            },
            right?: {
                type?: string,
                onClick?: Function | null,
                to?: string | null,
                state?: Object | null,
                component?: React.ComponentType | null,
            }
        },
        tabBar: {
            show: boolean,
            onClick?: (e: Event) => void,
        }
    } = {
        topBar: {
            titleIcon: IconMenuHome,
            title: 'Accueil',
            left: {
                type: 'spaces',
                onClick: null,
                to: null,
                state: null,
                component: null,
            },
        },
        tabBar: {
            show: true,
            onClick: () => {},
        },
    }

    @observable topBar = this.default.topBar

    @observable tabBar = this.default.tabBar
}
