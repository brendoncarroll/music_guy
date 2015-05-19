
var fs = require('fs-extra');

module.exports = function config(filepath) {
    var configString = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });
    var that = JSON.parse(configString);
    that.musicFolder = path.resolve(that.musicFolder);
    console.log(that.musicFolder);
    return that;
};
