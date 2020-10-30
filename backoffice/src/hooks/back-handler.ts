import { useCallback, useEffect } from 'react'

export default function useBackHandler(onBackPressed: any, deps: any) {
    const callback = useCallback(onBackPressed, deps)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', callback)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('popstate', callback)
            }
        }
    }, [callback])
}
