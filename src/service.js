const zlib = require('zlib');


function helloWorld(content) {
    const startIndex = content.indexOf('<body');
    const insertIndex = content.indexOf('>', startIndex);
    const hw = '<div style="font-size: 30px; color: blue; position: absolute; top: 100px; left: 45%; z-index: 1000;">Hello, World!!!</div>';
    return content.substr(0, insertIndex + 1) + hw + content.substr(insertIndex + 1);
}

async function alterContent(content) {
    return new Promise((resolve, reject) => {
        zlib.unzip(
            content,
            (err, buffer) => {
                if (err) {
                    reject(err);
                }
                const result = helloWorld(buffer.toString());
                resolve(result);
            },
        );
    });
}

module.exports = {
    alterContent,
};
