const {
    spawn
} = require('child_process');
const plog = require('./plog');

const setWebProxy = (host, port) => {
    const command = spawn('networksetup', ['-setwebproxy', 'Wi-fi', host || '127.0.0.1', port || '6001']);
    plog(command);
};

const offWebProxy = () => {
    const command = spawn('networksetup', ['-setwebproxystate', 'Wi-fi', 'off']);
    plog(command);
};

const getWebProxy = () => {
    const command = spawn('networksetup', ['-getwebproxy', 'Wi-fi']);
    plog(command);
};

module.exports = {
    setWebProxy,
    offWebProxy,
    getWebProxy
};
