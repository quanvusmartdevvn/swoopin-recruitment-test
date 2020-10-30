const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/.cache/dev-404-page.js"))),
  "component---src-pages-404-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/404.tsx"))),
  "component---src-pages-help-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/help.tsx"))),
  "component---src-pages-index-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/index.tsx"))),
  "component---src-pages-login-index-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/login/index.tsx"))),
  "component---src-pages-logout-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/logout.tsx"))),
  "component---src-pages-map-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/map.tsx"))),
  "component---src-pages-vehicles-tsx": hot(preferDefault(require("/Users/catalina/Desktop/swoopin-recruitment-test/backoffice/src/pages/vehicles.tsx")))
}

