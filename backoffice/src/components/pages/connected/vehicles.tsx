import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'
import { navigate } from 'utils/router'

import state from 'state'

import {
    useLayoutConfig, useLocationState, useRadioSelector, useCallback
} from 'hooks'

import SEO from 'components/layout/seo'
import { IconVehicles } from 'components/shared/icons'

import { Vehicle } from 'components/shared/connected'

import './vehicles.scss'

const block = 'page-vehicles'
const cx = classNamesPrefix(block)

const PageVehicles = observer(({ location } : { location: any }) => {

    useLayoutConfig({
        topBar: {
            titleIcon: IconVehicles,
            title: 'Véhicules',
        },
    })

    const connectedState : { tab: 'all' | 'online'} = useLocationState(location, 'connected')

    const { selected, isSelected, select } = useRadioSelector(connectedState.tab || 'all')

    const onTabClick = useCallback((tab) => {
        select(tab)
        navigate(location.pathname, {
            state: {
                ...(location.state || {}),
                connected: { tab },
            },
            replace: true,
        })
    }, [])

    const onAllClick = useCallback(() => onTabClick('all'), [])
    const onOnlineClick = useCallback(() => onTabClick('online'), [])

    return (
        <section id="page-vehicules" className={block}>
            <SEO title='Véhicules' />

            <div className={cx('__tabs')}>
                <button
                    type="button"
                    className={cx('__tab', { '__tab--active': isSelected('all') })}
                    onClick={onAllClick}
                >
                    Tous les véhicules
                </button>
                <button
                    type="button"
                    className={cx('__tab', { '__tab--active': isSelected('online') })}
                    onClick={onOnlineClick}
                >
                    Véhicules connectés
                </button>
            </div>

            <div className={cx('__content')}>
                {
                    // @ts-ignore
                    state.vehicles[selected].length > 0 ? (
                        // @ts-ignore
                        state.vehicles[selected].map((vehicle: any) => <Vehicle key={vehicle.id} {...vehicle} />)
                    ) : (
                        <div className={cx('__empty')}>
                            Aucun véhicule connecté
                        </div>
                    )
                }
            </div>

        </section>
    )
})

export default PageVehicles
