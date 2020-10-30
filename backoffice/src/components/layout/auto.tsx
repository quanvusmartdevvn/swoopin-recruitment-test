import React, { ReactElement } from 'react'

const layouts = [
    {
        paths: ['login', 'welcome'],
        component: 'login',
    },
]

const LayoutAuto = (props : {
    path: string,
    children: ReactElement,
    location: {
        pathname: string,
    },
}) => {
    const { path, children } = props

    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
        return null
    }

    if (path.startsWith('/dev')) {
        return children
    }

    /* eslint-disable global-require */
    const loadedComponents = {
        login: require('./login').default,
        connected: require('./connected').default,
    }
    /* eslint-enable global-require */

    const defaultLayout = {
        // eslint-disable-next-line global-require
        component: loadedComponents.connected,
        className: path.split('/')[0],
    }

    const layout = (
        layouts
            // Extract path and className
            .map((l: any) => {
                const matchedPath = l.paths.find((p: any) => path.startsWith(`/${p}`))

                if (matchedPath) {
                    const className = path.split(`/${matchedPath}/`)[1].split('/')[0]
                    return {
                        // @ts-ignore
                        component: loadedComponents[l.component],
                        className,
                    }
                }

                return {
                    component: null,
                    className: null,
                }
            })
            // Take the first matched path
            .find(l => !!l.component)
    ) || (defaultLayout)

    const LayoutComponent = layout.component

    return (
        <LayoutComponent {...props} className={layout.className}>
            {children}
        </LayoutComponent>
    )
}


export { LayoutAuto as default }
