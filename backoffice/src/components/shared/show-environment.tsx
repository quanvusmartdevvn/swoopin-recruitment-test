import React from 'react'
import { observer } from 'mobx-react'

import state from 'state'

const ShowEnvironment = () => {
    const { configuration } = state.configuration

    if (!configuration || !configuration.app || !configuration.app.showEnvironment) {
        return null
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: '64px',
            backgroundColor: 'white',
            border: '1px solid #757575',
            color: '#424242',
            borderTop: 'none',
            zIndex: 10000,
            borderRadius: '0 0 10px 10px',
            padding: '0 8px',
            fontWeight: 600,
            fontSize: '12px',
        }}
        >
            {configuration.app.showEnvironment.toUpperCase()}
        </div>
    )
}

export default observer(ShowEnvironment)
