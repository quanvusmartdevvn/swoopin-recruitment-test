import React from 'react'
import RouterLink from 'gatsby-link'
import { Location } from '@reach/router'

import { sanitizePathname } from 'utils/router'

const isPartiallyActive = ({ className } : { className?: string }) => ({
    isPartiallyCurrent,
} : { isPartiallyCurrent: boolean }) => (isPartiallyCurrent
    ? { className: `${className} active` }
    : { className })


const isActive = ({ className } : { className?: string }) => ({
    isCurrent,
}: { isCurrent: boolean }) => (isCurrent
    ? { className: `${className} active` }
    : { className })

const Link = ({
    to, exact, state, ...props
} : { state?: any, to: string, exact?: string } | {[key: string]: any, className?: string}) => (
    <Location>
        {({ location }) => {
            const { pathname } = location

            const path = sanitizePathname({
                to,
                pathname,
            })

            return (
                <RouterLink
                    {...props}
                    state={{
                        ...location.state,
                        ...state,
                    }}
                    to={path}
                    getProps={exact ? isActive(props) : isPartiallyActive(props)}
                />
            )
        }}
    </Location>
)

export default Link
