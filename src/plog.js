// process log
const plog = (command) => {
    let res = '';
    command.stdout.on('data', (data) => {
        res += data.toString();
    });
    command.stderr.on('data', (data) => {
        log(`stderr: ${data}`);
    });
    command.on('close', () => {
        log(res);
    });
};

const log = console.log; //eslint-disable-line

module.exports = plog;
