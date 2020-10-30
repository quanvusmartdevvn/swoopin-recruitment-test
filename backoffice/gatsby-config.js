const path = require('path')
const { getConfiguration } = require('../script/configuration')

module.exports = {
  siteMetadata: {
    title: 'CoursierPrive WMS - Client',
    description: '',
    author: '@vincent.wuhrlin',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-typescript',
    'gatsby-plugin-ts-config',
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/components/layout/auto.tsx'),
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /resources\/(icons|inline)/,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-root-import',
      options: (function createImportOptions() {
        const options = {};

        ([
          'components',
          'hooks',
          'controllers',
          'pages',
          'state',
          'style',
          'utils',
          'resources',
          'services',
        ])
          .forEach((key) => {
            options[key] = path.join(__dirname, `src/${key}`)
          })

        return options
      }()),
    },
  ],

  developMiddleware(app) {
    app.get('/configuration.json', (req, res) => {
      res.send(getConfiguration())
    })
  },
}
