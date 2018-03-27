const fs = require('fs');
const {promisify} = require('es6-promisify');
const path = require('path');

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const getUserHome = () => {
    return process.env['HOME'];
};

const existsFile = (filePath) => {
    return new Promise((resolve) => {
        stat(filePath).then((statObj) => {
            resolve(statObj.isFile());
        }).catch(() => {
            resolve(false);
        });
    });
};

const getConfig = () => {
    const configPath = path.join(getUserHome(), 'fe_proxy.json');
    return existsFile(configPath).then((has) => {
        if (!has) {
            return {};
        } else {
            return readFile(configPath, 'utf-8').then((txt) => {
                return JSON.parse(txt);
            });
        }
    });
};

module.exports = {
    getConfig
};

