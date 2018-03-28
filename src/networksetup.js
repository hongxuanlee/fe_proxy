const {
    spawn,
    execSync
} = require('child_process');
const plog = require('./plog');

const log = console.log; // eslint-disable-line

const findNetworkService = () => {
    const deviceName = execSync('route get example.com | grep interface').toString().replace(/\s*interface:\s(.*)/, '$1');
    const service = execSync(`networksetup -listnetworkserviceorder | grep ${deviceName}`).toString();
    const serviceName = service.match(/Hardware\sPort:\s(.*),/);
    if (serviceName) {
        return serviceName[1];
    }
    return null;
};

const serviceName = findNetworkService() || 'Wi-fi';

log(`network serviceName is ${serviceName}`);

const setWebProxy = (host, port) => {
    const command = spawn('networksetup', ['-setwebproxy', serviceName, host || '127.0.0.1', port || '6001']);
    plog(command);
};

const offWebProxy = () => {
    const command = spawn('networksetup', ['-setwebproxystate', serviceName, 'off']);
    plog(command);
};

const getWebProxy = () => {
    const command = spawn('networksetup', ['-getwebproxy', serviceName]);
    plog(command);
};


module.exports = {
    setWebProxy,
    offWebProxy,
    getWebProxy
};
