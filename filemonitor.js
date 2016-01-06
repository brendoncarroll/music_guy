
var chokidar = require('chokidar');
var path = require('path');
var mm = require('musicmetadata');
var fs = require('fs');

function FileMonitor(library, dirpath) {
    that = {
        lib: library,
        dirpath: dirpath,
    };
    if (!fs.statSync(dirpath).isDirectory()) {
        throw "Error: " + dirpath + " is not a directory.";
    }
    console.log('Now Monitoring ', dirpath);

    that.watcher = chokidar.watch(that.dirpath, {
        alwaysStat: true,
        ignored: [MGFOLDER+'*', 'iTunes*'],
        persistent: true,
    });

    that.update = function(filepath, stats) {
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.lib.addMediafile(mediafile);
            process.emit('mediaFileUpdate', mediafile);
        });
    };

    that.add = function (filepath, stats) {
        console.log('Added new mediafile ', filepath);
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.lib.addMediafile(mediafile);
        });
    };

    that.handleAdd = function (filepath, stats) {
        // Check if supported filetype
        if (!SUPPORTED_FILETYPES[path.extname(filepath)]) {
            return;
        }
        that.lib.findAtPath(filepath, function (doc) {
            // Not in db
            if (doc === null) {
                that.add(filepath, stats);
            }
            // In db and out of date
            else if (stats.mtime > doc.mtime) {
                that.update(filepath, stats);
            }
        });
    };

    that.handleChange = function (filepath, stats) {
        console.log('change', filepath);
    };

    that.handleUnlink = function (filepath, stats) {
        console.log('Removing ', filepath);
        that.lib.removeMediafileAtPath(filepath);
    };

    that.handleError = function (error) {
        console.error(error);
    };

    that.handleReady = function () {
        console.log('File Monitor: finished initial scan');
    };

    that.watcher
        .on('add', that.handleAdd)
        .on('change', that.handleChange)
        .on('unlink', that.handleUnlink)
        .on('ready', that.handleReady)
        .on('error', that.handleError);

    return that;
}

module.exports = FileMonitor;
