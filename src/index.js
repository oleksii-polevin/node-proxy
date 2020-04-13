const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

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
    proxyRes.on('end', () => {
        body = Buffer.concat(body);
        res.setHeader('Cache-control', 'no-cache');
        res.setHeader('Content-Encoding', 'gzip');
        res.end(body);
    });
});

http.createServer((req, res) => {
    const { query } = url.parse(req.url, true);
    if (query.host) {
        option.target = query.host;
    }
    proxy.web(req, res, option);
}).listen(3000);
