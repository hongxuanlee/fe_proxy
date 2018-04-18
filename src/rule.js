const jsonTrans = require('json-transfer');

const matchUrl = (path, config) => {
    return config.find(item => {
        const urlMatch = new RegExp(item.url);
        return urlMatch.test(path);
    });
};

const handleResponse = (pathRule, chunks) => {
    let data;
    try {
        data = JSON.parse(Buffer.from(chunks));
    } catch (e) {} // eslint-disable-line
    if (!data) return chunks;
    log(`modify url: ${pathRule.url}  according to rules: ${JSON.stringify(pathRule.rules)}`);
    data = jsonTrans(data, pathRule.rules);
    return Buffer.from(JSON.stringify(data));
};

const log = console.log; //eslint-disable-line

module.exports = {
    matchUrl,
    handleResponse
};
