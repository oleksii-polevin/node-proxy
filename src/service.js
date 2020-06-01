const zlib = require('zlib');

/**
 * Inserts `Hello, World` message
 * @function
 * @param {String} content web page content
 * @returns {String} altered content
 */
function helloWorld(content) {
    const startIndex = content.indexOf('<body');
    const insertIndex = content.indexOf('>', startIndex);
    const hw = '<div style="font-size: 30px; background-color: white; color: blue; position: absolute; top: 100px; left: 45%; z-index: 1000;">Hello, World!!!!!!!!</div>';
    return content.substr(0, insertIndex + 1) + hw + content.substr(insertIndex + 1);
}

/**
 * Compressed content with gzip method
 * @async
 * @param {Buffer} buffer page content
 * @returns {Promise< gzip >} compressed content
 */
async function compression(buffer) {
    return new Promise((resolve, reject) => {
        const changedContent = helloWorld(buffer.toString());
        zlib.gzip(changedContent, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

/**
 * Decompress content, alter it and compress
 * @async
 * @param {'gz'} content
 * @returns {Promise< gzip >} compressed and altered content
 */
async function alterContent(content, encoding) {
    if (encoding === 'br') {
        return new Promise((resolve, reject) => {
            zlib.brotliDecompress(
                content,
                (err, buffer) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(compression(buffer));
                },
            );
        });
    } if (encoding === 'gzip' || encoding === 'deflate') {
        return new Promise((resolve, reject) => {
            zlib.unzip(
                content,
                (err, buffer) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(compression(buffer));
                },
            );
        });
    }
    return content;
}

module.exports = {
    alterContent,
};
