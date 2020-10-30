import { useLocalStore } from 'mobx-react'
import { useEffect } from 'react'

type Instantiable<T> = {new(...args: any[]): T}

export default function useLocationState<T>(
    location: any,
    identifier: any,
    constructor?: Instantiable<T>,
) : T {
    const store = useLocalStore(() => {
        // Check that location has state
        if (!location.state || !location.state[identifier]) {
            return constructor ? new constructor() : {}
        }

        return constructor ? new constructor(location.state[identifier]) : { ...location.state[identifier] }
    })

    useEffect(() => store.destroy, [])

    return store
}
