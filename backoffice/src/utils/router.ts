import { navigate as routerNavigate } from 'gatsby-link'

export function sanitizePathname({
  to,
  pathname,
}) : string {
  let path = to

  // If path is already absolute, use it as-is. Else, resolve from current path
  if (!path.startsWith('/')) {
    const pathParts = pathname.split('/')
    const toParts = to.split('/')

    // Remove the trailing slash, if any
    if (pathParts.slice(-1)[0] === '') {
      pathParts.pop()
    }

    toParts.forEach((part) => {
      // If we're on a up command...
      if (part === '..') {
        // ... go up one part of the path
        pathParts.pop()
        return
      }

      // If we're on a same command...
      if (part === '.') {
        // ... do nothing
        return
      }

      pathParts.push(part)
    })

    path = pathParts.join('/')
  } else if (pathname.startsWith('/m/') && !path.startsWith('/m/')) {
    // Check if we are on a mobile page
    path = `/m${path}`
  }

  // Always add trailing slash for active route matching, except if there is a #
  if (path.indexOf('#') < 0) {
    const split = path.split('?')
    split[0] = split[0].endsWith('/') ? (split[0]) : (`${split[0]}/`)
    path = split.join('?')
  }

  return path
}

export function navigate(to, params?) {
  return routerNavigate(sanitizePathname({ to, pathname: window.location.pathname }), params)
}
