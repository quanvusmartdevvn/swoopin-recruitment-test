import { useEffect } from 'hooks'
import { navigate } from 'utils/router'

const SwitchRouter = ({
    loading, condition, redirect, children,
} : {
    loading: boolean,
    condition: boolean,
    redirect: string,
    children: any
}) => {
    useEffect(() => {
        if (!loading && condition && typeof window !== 'undefined') {
            window.setTimeout(() => {
                navigate(redirect)
            }, 0)
        }
    }, [loading, condition])

    return (!condition && !loading) ? children : null
}

export default SwitchRouter
