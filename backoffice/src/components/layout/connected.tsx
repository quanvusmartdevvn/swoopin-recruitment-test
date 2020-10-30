import React from 'react'

import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'

import ConnectedRouter from 'components/shared/routers/connected'

import ShowEnvironment from 'components/shared/show-environment'

import TopBar from './connected/top-bar'
import TabBar from './connected/tab-bar'

import './connected.scss'

const block = 'connected'
const cx = classNamesPrefix(block)

const LayoutConnected = observer(({ children, location } : { children: any, location: any }) => {

    return (
        <ConnectedRouter>
            <div
                className={cx('container')}>
                {/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className={cx(block)}>
                    <main className={cx('content')}>
                        {children}
                    </main>
                    <TopBar location={location} />
                    <TabBar location={location} />
                </div>

                <ShowEnvironment />

            </div>
        </ConnectedRouter>
    )
})

export default LayoutConnected
