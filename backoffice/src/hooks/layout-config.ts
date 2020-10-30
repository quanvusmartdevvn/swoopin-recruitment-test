import { runInAction } from 'mobx'
import { useCallback, useEffect } from 'react'
import state from '../state'

export default function useLayoutConfig(config : Partial<typeof state.layout.default>) {
    const {
        topBar,
        tabBar,
    } = config

    const setConfig = useCallback(() => {
        // Wrap in timeout to act after React lifecycle events
        setTimeout(() => {
            runInAction(() => {
                state.layout.topBar.title = (topBar && topBar.title) || state.layout.topBar.title
                state.layout.topBar.titleIcon = (topBar && topBar.titleIcon) || state.layout.topBar.titleIcon

                state.layout.topBar.left = (topBar && topBar.left) || state.layout.default.topBar.left
                state.layout.topBar.right = (topBar && topBar.right) || state.layout.default.topBar.right

                state.layout.tabBar.show = !tabBar || tabBar.show !== false
                state.layout.tabBar.onClick = (tabBar && tabBar.onClick) || state.layout.default.tabBar.onClick
            })
        })
    }, [topBar, tabBar])

    useEffect(() => {
        setConfig()
        return setConfig
    })
}

export const SetLayout = ({ config } : { config: any }) => {
    useLayoutConfig(config)

    return null
}
