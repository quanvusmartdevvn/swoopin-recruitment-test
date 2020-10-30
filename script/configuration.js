const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const base64 = require('base-64');

const getConfiguration = () => {
    const configurationAsYaml = fs.readFileSync(path.join(__dirname, '../conf/application.yml'), 'utf-8');
    const configurationAsJson = JSON.stringify(yaml.safeLoad(configurationAsYaml).app);
    return base64.encode(configurationAsJson);
};

module.exports = {
    getConfiguration,
};
