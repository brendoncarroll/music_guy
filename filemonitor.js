
var chokidar = require('chokidar');
var path = require('path');
var mm = require('musicmetadata');
var fs = require('fs');

function FileMonitor(db, dirpath) {
    that = {
        db: db,
        dirpath: dirpath,
    };
    if (!fs.statSync(dirpath).isDirectory()) {
        throw "Error: " + dirpath + " is not a directory.";
    }
    console.log('Now Monitoring ', dirpath);

    that.mediafiles = that.db.collection("mediafiles");
    that.watcher = chokidar.watch(that.dirpath, {
        alwaysStat: true,
        ignored: /\/_music_guy\/.*|(.*\/iTunes\/.*)/,
        persistent: false,
    });

    that.update = function(filepath, stats) {
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.mediafiles.update({
                path: filepath
            }, mediafile, function (err) {
                if (err) throw err;
            });
            process.emit('mediaFileUpdate', mediafile);
        });
    };

    that.add = function (filepath, stats) {
        console.log('Added new mediafile ', filepath);
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.mediafiles.insert(mediafile, function (err) {
                if (err) throw err;
                process.emit('mediaFileAdd', mediafile);
            });
        });
    };

    that.handleAdd = function (filepath, stats) {
        // Check if supported filetype
        if (!SUPPORTED_FILETYPES[path.extname(filepath)]) {
            return;
        }
        that.mediafiles.findOne({path: filepath}, function (err, doc) {
            if (err) {
                throw err;
            }
            // Not in db
            if (doc === null) {
                that.add(filepath, stats);
            }
            // In db and out of date
            else if (stats.mtime > stats.mtime) {
                that.update(filepath, stats);
            }
        });
    };

    that.handleChange = function (filepath, stats) {
        console.log('change', filepath);
    };

    that.handleUnlink = function (filepath, stats) {
        console.log('Removing ', filepath);
        that.mediafiles.remove({path: filepath});
    };

    that.handleError = function (error) {
        console.error(error);
    };

    that.watcher
        .on('add', that.handleAdd)
        .on('change', that.handleChange)
        .on('unlink', that.handleUnlink)
        .on('error', that.handleError);

    return path;
}

module.exports = FileMonitor;
