
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

    that.processTemplateString = function () {
        var regex = /%(\w+)%/g;
        that.matches = [];
        while (true) {
            var match = regex.exec(that.templateString);
            if (!match) {
                break;
            }
            that.matches.push(match);
        }
    };

    that.sanitize = function (string) {
        Object.keys(that.replacements).forEach(function (badChar) {
            var goodChar = that.replacements[badChar];
            string = string.replace(badChar, goodChar);
        });
        return string;
    };

    that.processTag = function (tag) {
        if (tag !== undefined) {
            if (tag.constructor === Array) {
                return tag[0];
            } else {
                return tag;
            }
        } else {
            return tag;
        }
    };

    that.newFilepath = function (mediafile) {
        var newFilepath = that.templateString.slice(0);
        for (var i in that.matches) {
            match = that.matches[i];
            var tag = that.processTag(mediafile[match[1]]);
            if (tag) {
                newFilepath = newFilepath.replace(match[0], tag);
            } else {
                console.log('Could not rename ', mediafile.path);
                return mediafile.path;
            }
        }
        newFilepath = newFilepath + path.extname(mediafile.path);
        return path.join(CONFIG.musicFolder, newFilepath);
    };

    that.handleAdd = function (mediafile) {
        var newFilepath = that.newFilepath(mediafile);
        if (newFilepath !== mediafile.path) {
            console.error(newFilepath,'!==', mediafile.path);
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
    that.processTemplateString();

    return that;
}


module.exports = Renamer;
