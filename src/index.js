require('dotenv').config();
const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const service = require('./service');

const port = process.env.PORT || 5000;

// proxy options
const option = {
    target: '',
    followRedirects: true,
    selfHandleResponse: true,
    changeOrigin: true,
};

// proxy server
const proxy = httpProxy.createProxyServer();

/**
 * @description Listen for the `error` event on `proxy`
 */
proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain',
    });

    res.end('Something went wrong.');
});

/**
 * @description Listen for the `data` event on `proxy`
 */
proxy.on('proxyRes', (proxyRes, req, res) => {
    let body = [];

    proxyRes.on('data', (chunk) => {
        body.push(chunk);
    });

    proxyRes.on('end', async () => {
        body = Buffer.concat(body);
        try {
            const result = await service.alterContent(body);
            res.setHeader('Cache-control', 'no-cache');
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-length', result.length);
            res.end(result);
        } catch (error) {
            console.error(error);
        }
    });
});

/**
 * @description Creates http server
 */
const server = http.createServer((req, res) => {
    const { query } = url.parse(req.url, true);

    // for avoiding errors on second server request and correct re-assigning target property
    if (query.host) {
        option.target = query.host;
    }
    proxy.web(req, res, option);
});

server.listen(port);

console.log(`server listening port ${port}`);
