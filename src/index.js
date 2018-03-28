const http = require('http');
const url = require('url');
const DEFAULT_PORT = 6001;
const {
    matchUrl,
    handleResponse,
} = require('./rule');
const zlib = require('zlib');
const {
    getConfig
} = require('./config');
const {
    offWebProxy,
    setWebProxy
} = require('./networksetup');

const main = (host, port) => {
    setWebProxy(host, port);
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
                log(e);
            });
            cReq.pipe(pReq, {
                end: true
            });
        };
        const server = http.createServer(req);
        port = port || DEFAULT_PORT;
        server.listen(port, host || '0.0.0.0', () => {
            log(`Server running on ${port}`);
        });
    });

};

const log = console.log; //eslint-disable-line

// close web proxy when process exit
process.on('exit', () => {
    offWebProxy();
});

module.exports = main;
