
var fs = require('fs-extra');
var yaml = require('js-yaml');
var expandTilde = require('expand-tilde');

module.exports = function config(filepath) {
    var doc = yaml.safeLoad(fs.readFileSync(filepath));
    doc.musicFolder = expandTilde(doc.musicFolder);
    fs.statSync(doc.musicFolder);
    return doc;
};
