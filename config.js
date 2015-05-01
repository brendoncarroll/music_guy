
var fs = require('fs');

module.exports = function config(filepath) {
    var configString = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });
    return JSON.parse(configString);
};
