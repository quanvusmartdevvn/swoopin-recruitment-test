const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const { getConfiguration } = require('./configuration');

if (process.env.NODE_ENV !== 'development') {
    const publicPath = path.join(__dirname, '../build');

    console.log('Updating configuration...');
    const configuration = getConfiguration();

    fs.writeFileSync(path.join(publicPath, 'configuration.json'), configuration, 'utf-8');
    console.log('Done!')
}
