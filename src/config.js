const fs = require('fs');

const {
    promisify
} = require('es6-promisify');
const path = require('path');
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const CONFIG_FILE = 'fe_proxy.json';

const getUserHome = () => {
    return process.env['HOME'];
};

const getCwd = () => process.cwd();

const existsFile = (filePath) => {
    return new Promise((resolve) => {
        stat(filePath).then((statObj) => {
            resolve(statObj.isFile());
        }).catch(() => {
            resolve(false);
        });
    });
};

/**
 *  find cwd path => find user home path
 */
const findConfigFile = () => {
    const cwdPath = path.join(getCwd(), CONFIG_FILE);
    return existsFile(cwdPath).then(has => {
        if (!has) {
            const homePath = path.join(getUserHome(), CONFIG_FILE);
            return existsFile(homePath).then(has => {
                if (has) {
                    return homePath;
                }
                return null;
            });
        }
        return cwdPath;
    });
};

const getConfig = () => {
    return findConfigFile().then((filePath) => {
        if (!filePath) {
            return {};
        } else {
            return readFile(filePath, 'utf-8').then((txt) => {
                return JSON.parse(txt);
            });
        }
    });
};

module.exports = {
    getConfig
};
