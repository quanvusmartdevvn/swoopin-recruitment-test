import React, { useMemo } from 'react'
import { classNamesPrefix } from 'utils/react'

import { observer } from 'mobx-react'

import state from 'state'

import { useResponsive } from 'hooks'

import {
    IconMenuHome, IconVehicles, IconMap, IconHelp
} from 'components/shared/icons'
import { Link } from 'components/shared/semantics'

import './tab-bar.scss'

const block = 'tab-bar'
const cx = classNamesPrefix(block)

const TabBar = observer(({ location } : { location: any}) => {

    const responsive = useResponsive()

    const tabs = useMemo(() => ([
        {
            key: 'home',
            to: '/',
            exact: true,
            icon: IconMenuHome,
            className: "",
            title: 'Accueil',
        },
        {
            key: 'vehicles',
            to: '/vehicles',
            icon: IconVehicles,
            className: "",
            title: 'Véhicules',
        },
        {
            key: 'map',
            to: '/map',
            icon: IconMap,
            className: "",
            title: 'Carte',
        },
        {
            key: 'help',
            to: '/help',
            icon: IconHelp,
            className: "",
            title: 'Aide',
        },
    ]), [location.pathname])

    if (responsive.isMobile && !state.layout.tabBar.show) {
        return null
    }

    return (
        <footer className={block}>
            <div className={cx('__tabs')}>
                {
                    tabs.map(({ key, title, icon: Icon, ...tab }) => (
                        <Link
                            key={key}
                            {...tab}
                            onClick={state.layout.tabBar.onClick}
                            className={cx('__tab', `__tab--${key}`, `__tab--${tab.className}`)}
                        >
                            <Icon className={cx('__tab-icon')} />
                            <span className={cx('__tab-title')}>
                                {title}
                            </span>
                        </Link>
                    ))
                }
            </div>
        </footer>
    )
})

export default TabBar
