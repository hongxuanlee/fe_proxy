const matchUrl = (path, config) => {
    return config.find(item => path.indexOf(item.url) > -1);
};

const handleResponse = (pathRule, chunks) => {
    let data;
    try {
        data = JSON.parse(Buffer.from(chunks));
    } catch (e) {
        console.log('json parse error');
        console.log(chunks.join(''));
    }
    if (!data) return chunks;
    console.log('..........match.......');
    console.log(data);
    console.log('..........match. end......');
    pathRule.rules.forEach((rule) => {
        setValue(data, rule.path, rule.value);
        console.log(data);
    });
    return Buffer.from(JSON.stringify(data));
};



const setValue = (data = {}, jsonPath, value) => {
    const paths = jsonPath.split('.');
    let curObj = data;
    while (paths.length > 1) {
        const path = paths.shift();
        curObj = curObj[path];
    }
    if (paths[0]) {
        curObj[paths[0]] = value;
    }
};

module.exports = {
    matchUrl,
    handleResponse
};
