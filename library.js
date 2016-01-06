"use strict";

var Datastore = require('nedb');
var natural = require('natural');

var ATTRIBUTE_MASK = {
  title: 1,
  artist: 1,
  album: 1,
  _id: 1,
}

var FIELDS = ['title', 'artist', 'album'];

function regex(string) {
  return new RegExp('.*' + string + '.*', 'i');
}

class Library {

  constructor() {
    this.musicdb = new Datastore({
      filename: MGFOLDER + 'music.db',
      autoload: true,
    });

    // Set up indexes
    this.musicdb.ensureIndex({path: 1, unique: 1});
    this.musicdb.ensureIndex({title: 1});
    this.musicdb.ensureIndex({albumartist: 1});
    this.musicdb.ensureIndex({artist: 1});
    this.musicdb.ensureIndex({genre: 1});
  }

  get(id, callback) {
    this.musicdb.findOne({_id: id}, function (err, doc) {
      if (err) console.error(err);
      else if (doc) callback(doc);
    });
  }

  findAtPath(path, callback) {
    this.musicdb.findOne({path: path}, function (err, doc) {
      if (err) console.error(err);
      else callback(doc);
    });
  }

  addMediafile(mediafile) {
    this.musicdb.insert(mediafile, function (err) {
        if (err) console.error(err);
        process.emit('mediaFileAdd', mediafile);
    });
  }

  updateMediafile(mediafile) {
    this.musicdb.update({path: mediafile.path}, mediafile, function (err, newDoc){
        if (err) console.error(err);
    });
  }

  removeMediafileAtPath(path) {
    this.musicdb.remove({path: path}, function (err, numRemoved) {
      if (err) console.error(err);
    });
  }

  searchSongs(terms, callback) {
    let cache = {};
    let results = {};
    let count = 0;

    for (let term of terms) {
      for (let field of FIELDS) {
        let sobj = {};
        sobj[field] = regex(term);
        this.musicdb.find(sobj).exec(function (err, docs) {
          if (err) console.error(err);
          else {
            for (let doc of docs) {
              cache[doc._id] = doc;
              if (results[doc._id] === undefined) results[doc._id] = 1;
              else results[doc._id] = results[doc._id] + 1;
            }
            count++;
            if (count === FIELDS.length * terms.length) {
              let sorted = Object.keys(results).sort(function (a, b) {
                return results[b]- results[a];
              });
              let comp = sorted.map(function (e) {
                return [cache[e], results[e]];
              });
              callback(comp.slice(0,10));
            }
          }
        });
      }
    }
  }

  searchField(field, terms, callback) {
    for (let term of terms) {
      let sobj = {};
      sobj[field] = regex(term);
      this.musicdb.find(sobj, ATTRIBUTE_MASK).limit(50).exec(function (err, docs) {
        if (err) console.error(err);
        let sorted = docs.sort(function (a, b) {
          let adist = natural.JaroWinklerDistance(a[field], term);
          let bdist = natural.JaroWinklerDistance(b[field], term);
          return bdist - adist;
        });
        callback(sorted);
      });
    }
  }

  search(query, callback) {
    let terms = query.split(' ');
    let results = {};
    let count = 0;
    for (let field of FIELDS) {
      switch (field) {
      case 'artist':

      default:
        this.searchField(field, terms, function (subresults) {
          results[field + 's'] = subresults.slice(0,10);
          count++;
          if (count === FIELDS.length && callback) callback(results);
        });
      }
    }
  }

  random(callback) {
    this.musicdb.find({}, ATTRIBUTE_MASK, function (err, docs) {
      if (err) console.error(err);
      else callback({titles: docs});
    })
  }
}

module.exports = Library;
