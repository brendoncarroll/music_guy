
var chokidar = require('chokidar');
var path = require('path');
var mm = require('musicmetadata');
var fs = require('fs');

function FileMonitor(db, dirpath) {
    that = {
        db: db,
        dirpath: dirpath,
    };
    console.log('Now Monitoring ', dirpath);

    that.mediafiles = that.db.collection("mediafiles");
    that.watcher = chokidar.watch(that.dirpath, {
        alwaysStat: true,
        ignored: /\/music.db\/.*/,
        persistent: false,
    });

    that.update = function(filepath, stats) {
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.mediafiles.update({
                path: filepath
            }, mediafile);
            process.emit('mediaFileUpdate', mediafile);
        });
    };

    that.add = function (filepath, stats) {
        console.log('Added new mediafile ', filepath);
        mm(fs.createReadStream(filepath), function(err, mediafile) {
            delete mediafile.picture;
            mediafile.mtime = stats.mtime;
            mediafile.path = filepath;
            that.mediafiles.insert(mediafile);
            process.emit('mediaFileAdd', mediafile);
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

    that.watcher
        .on('add', that.handleAdd)
        .on('change', that.handleChange)
        .on('unlink', that.handleUnlink);

    return path;
}

module.exports = FileMonitor;
