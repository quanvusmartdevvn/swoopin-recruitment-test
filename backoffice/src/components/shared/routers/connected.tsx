import React from 'react'
import { observer } from 'mobx-react'

import state from 'state'

import SwitchRouter from './switch'

const ConnectedRouter = observer(({ children, login = false } : { children: any, login?: boolean }) => (
    <SwitchRouter
        condition={login ? state.session.connected : !state.session.connected}
        redirect={login ? '/' : '/login'}
        loading={state.session.loading}
    >
        { children }
    </SwitchRouter>
))

export default ConnectedRouter
