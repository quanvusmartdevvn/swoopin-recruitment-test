import React from 'react'
import { observer } from 'mobx-react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'style/style.scss'

import ConnectedRouter from 'components/shared/routers/connected'
import ShowEnvironment from 'components/shared/show-environment'

import './login.scss'

const LayoutLogin = ({ children, className } : { children: any, className?: string }) => {
    return (
        <ConnectedRouter login>
            <main key="login" id="login" className={className}>
                <div className="background">
                    <div className="placer" />
                    <div className="image" />
                </div>
                <div className="panel">
                    <div className="content">
                        {children}
                    </div>
                    <div className="placer" />
                </div>
            </main>
            <ShowEnvironment />
        </ConnectedRouter>
    )
}

export default observer(LayoutLogin)
