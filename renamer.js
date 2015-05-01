
var path = require('path');
var fs = require('fs-extra');

function Renamer(templateString) {
    if (!templateString) throw 'templateString invalid';
    var that = {
        templateString: templateString,
        replacements: {
            ':': '-',
            '/': '-'
        }
    };
    console.log('Renamer using', templateString);

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
            console.log('Renaming', mediafile.path, ' to ', newFilepath);
            fs.move(mediafile.path,
                newFilepath,
                {clobber: false},
                function (err) {
                    //if (err) throw err;
            });
        }
    };

    process.on('mediaFileAdd', that.handleAdd);

    return that;
}


module.exports = Renamer;
