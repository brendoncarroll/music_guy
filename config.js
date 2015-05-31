
var fs = require('fs-extra');

module.exports = function config(filepath) {
    var configString = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });
    var that = JSON.parse(configString);
    fs.statSync(that.musicFolder);
    return that;
};
