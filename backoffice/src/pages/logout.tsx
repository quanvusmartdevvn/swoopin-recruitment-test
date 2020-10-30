import state from 'state'

import { useEffect } from 'hooks'

export default () => {
    useEffect(() => {
        setTimeout(() => {
            state.session.updateToken(false)
        }, 1000)
    }, [])

    return null
}
