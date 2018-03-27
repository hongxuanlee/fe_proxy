const http = require('http');
const url = require('url');
const port = 6001;
const {
    handleResponse,
    matchUrl
} = require('./rule');
const zlib = require('zlib');
const {
    getConfig
} = require('./config');

getConfig().then(config => {
    function getRequestOption(cReq) {
        const u = url.parse(cReq.url);
        const host = u.hostname || cReq.headers.host;

        let options = {
            host,
            port: u.port || 80,
            path: u.path,
            method: cReq.method,
            headers: cReq.headers
        };
        options.headers['accept-encoding'] = '*';
        return options;
    }

    const req = (cReq, cRes) => {
        const options = getRequestOption(cReq);
        const matchRule = matchUrl(options.path, config);
        const pReq = http.request(options, function(pRes) {
            const resOption = pRes.headers;
            cRes.writeHead(pRes.statusCode, resOption);

            let chunks = [];
            pRes.on('data', (chunk) => {
                if (!matchRule) {
                    cRes.write(chunk);
                } else {
                    console.log(chunk);
                    chunks.push(chunk);
                }
            });
            pRes.on('end', () => {
                if (matchRule) {
                    const isGzip = resOption['content-encoding'] === 'gzip';
                    chunks = isGzip ? zlib.gunzipSync(Buffer.concat(chunks)) : chunks;
                    let returnBody = handleResponse(matchRule, chunks);
                    returnBody = isGzip ? zlib.gzipSync(returnBody) : chunks;
                    cRes.write(returnBody);
                }
                cRes.end();
            });
        }).on('error', function(e) {
            cRes.end();
        });
        cReq.pipe(pReq, {
            end: true
        });
    };
    const server = http.createServer(req);

    server.listen(port, '0.0.0.0', () => {
        console.log(`Server running on ${port}`);
    });
});
