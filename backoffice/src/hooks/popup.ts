import { useCallback, useEffect, useState } from 'react'
import { useLocalStore } from 'mobx-react'

import { navigate } from 'utils/router'

import useBackHandler from './back-handler'

export const usePopupController = () => {
    const [show, setShow] = useState(() => () => null)
    const register = useCallback(s => setShow(() => s), [setShow])

    return {
        show,
        register,
    }
}

export const usePopupState = (register: any, defaultShow = false) => {
    const popup = useLocalStore(() => ({
        show: defaultShow,
        open() {
            popup.show = true
        },
        close() {
            popup.show = false
        },
        toggle() {
            popup.show = !popup.show
        },
    }))

    useEffect(() => {
        register(popup.open)
    }, [popup.open])

    const to = window.location.pathname
    useBackHandler((e: any) => {
        if (popup.show) {
            if (e.type === 'popstate') {
                navigate(to, { replace: true })
            } else {
                e.preventDefault()
            }

            popup.close()
        }
    }, [popup.show, to])

    return popup
}
