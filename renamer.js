
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

function Renamer(templateString) {
    var that = {
        templateString: templateString,
        replacements: {
            ':': '-',
        }
    };

    that.fixFilepath = function (filepath) {
        Object.keys(that.replacements).forEach(function (badChar) {
            var goodChar = that.replacements[badChar];
            filepath = filepath.replace(badChar, goodChar);
        });
        return filepath;
    };

    that.newFilepath = function (mediafile) {
        var regex = /%(\w+)%/g;
        var matches = [];
        while (true) {
            var match = regex.exec(templateString);
            if (!match) {
                break;
            }
            matches.push(match);
        }
        var newFilepath = templateString;
        matches.forEach(function (match) {
            var attr = mediafile[match[1]];
            if (attr !== undefined) {
                if (attr.constructor === Array) {
                    attr = attr[0];
                }
            }
            newFilepath = newFilepath.replace(match[0], attr);
        });
        newFilepath = newFilepath + path.extname(mediafile.path);
        return path.join(CONFIG.musicFolder, newFilepath);
    };

    that.handleAdd = function (mediafile) {
        var newFilepath = that.newFilepath(mediafile);
        newFilepath = that.fixFilepath(newFilepath);
        if (newFilepath !== mediafile.path) {
            console.log('Renaming', mediafile.path, ' to ', newFilepath);
            mkdirp(path.dirname(newFilepath), function (err) {
                if (err) { return; }
                fs.rename(mediafile.path, newFilepath, function (err) {
                });
            });
        }
    };

    process.on('mediaFileAdd', that.handleAdd);

    return that;
}


module.exports = Renamer;

function main() {
    rn = Renamer('%albumartist%/%album%/%title%');
    var filepath = '/home/brendon/Music/Taylor Swift/Speak Now/Taylor Swift - Mean.flac';
    rn.handleAdd(filepath, {}, {artist: title});
}
