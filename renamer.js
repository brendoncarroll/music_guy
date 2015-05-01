
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

function Renamer(templateString) {
    var that = {
        templateString: templateString,
        replacements: {
            ':': '-',
            '/': '-'
        }
    };

    that.sanitize = function (string) {
        Object.keys(that.replacements).forEach(function (badChar) {
            var goodChar = that.replacements[badChar];
            string = string.replace(badChar, goodChar);
        });
        return string;
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
                if (attr !== undefined) {
                    attr = that.sanitize(attr);
                }
            }
            newFilepath = newFilepath.replace(match[0], attr);
        });
        newFilepath = newFilepath + path.extname(mediafile.path);
        return path.join(CONFIG.musicFolder, newFilepath);
    };

    that.handleAdd = function (mediafile) {
        var newFilepath = that.newFilepath(mediafile);
        if (newFilepath !== mediafile.path) {
            fs.exist(newFilepath, function (exists) {
                if (exists) {
                    console.log('Could not rename ', mediafile.path);
                    return;
                }
                console.log('Renaming', mediafile.path, ' to ', newFilepath);
                mkdirp(path.dirname(newFilepath), function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    fs.rename(mediafile.path, newFilepath, function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
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
