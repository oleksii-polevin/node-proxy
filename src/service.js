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
    const hw = '<div style="font-size: 30px; color: blue; position: absolute; top: 100px; left: 45%; z-index: 1000;">Hello, World!!!</div>';
    return content.substr(0, insertIndex + 1) + hw + content.substr(insertIndex + 1);
}

/**
 * Decompress content, alter it and compress
 * @async
 * @param {'gz'} content
 * @returns {Promise< gzip >} compressed and altered content
 */
async function alterContent(content) {
    return new Promise((resolve, reject) => {
        zlib.unzip(
            content,
            (err, buffer) => {
                if (err) {
                    reject(err);
                }
                if (typeof buffer !== 'undefined') {
                    const changedContent = helloWorld(buffer.toString());
                    zlib.gzip(changedContent, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(result);
                    });
                }
            },
        );
    });
}

module.exports = {
    alterContent,
};
