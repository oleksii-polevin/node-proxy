const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const service = require('./service');


const option = {
    target: '',
    followRedirects: true,
    selfHandleResponse: true,
    changeOrigin: true,
};

const proxy = httpProxy.createProxyServer();


proxy.on('proxyRes', (proxyRes, req, res) => {
    let body = [];
    proxyRes.on('data', (chunk) => {
        body.push(chunk);
    });
    proxyRes.on('end', async () => {
        body = Buffer.concat(body);
        res.setHeader('Cache-control', 'no-cache');
        // res.setHeader('Content-Encoding', 'gzip');
        const result = await service.alterContent(body);
        res.setHeader('Content-length', result.length);
        res.end(result);
    });
});

http.createServer((req, res) => {
    const { query } = url.parse(req.url, true);

    if (query.host) {
        option.target = query.host;
    }
    proxy.web(req, res, option);
}).listen(3000);
