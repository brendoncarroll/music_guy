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

class Results {
  constructor(){
    this.items = {};
    this.cache = {};
  }

  add(subresults) {
    for (let r of subresults) {
      this.cache[r._id] = r;
      if (this.items[r._id] === undefined) this.items[r._id] = 1
      else this.items[r._id] = this.items[r._id] + 1;
    }
  }

  toArray() {
    var results = this.items;
    var cache = this.cache
    let pairs = Object.keys(results).map(function (e) {
          return [e, results[e]]
    });
    let sorted = pairs.sort(function (a, b) {
      return b[1] - a[1];
    }).map(function (e) {
      return cache[e[0]];
    });
    return sorted;
  }
}

class Library {

  constructor() {
    this.musicdb = new Datastore({
      filename: MGFOLDER + 'music.db',
      autoload: true,
    });

    this.artistdb = new Datastore({
      filename: MGFOLDER + 'artist.db',
      autoload: true
    })

    this.albumdb = new Datastore({
      filename: MGFOLDER + 'album.db',
      autoload: true
    })

    // DEV MODE
    this.musicdb.remove({},{multi: true});
    this.artistdb.remove({}, {multi: true});

    // Set up indexes
    this.musicdb.ensureIndex({fieldName: 'path', unique: true});
    this.musicdb.ensureIndex({fieldName: 'title'});
    this.musicdb.ensureIndex({fieldName: 'albumartist'});
    this.musicdb.ensureIndex({fieldName: 'artist'});
    this.musicdb.ensureIndex({fieldName: 'genre'});

    this.artistdb.ensureIndex({fieldName: 'name', unique: true});
  }

  get(id, callback) {
    this.musicdb.findOne({_id: id}, function (err, doc) {
      if (err) console.error(err);
      else if (doc) callback(doc);
    });
  }

  getArtist(name, callback) {
    var musicdb = this.musicdb
    this.artistdb.findOne({name: name}, function (err, doc) {
      var artist = doc;
      musicdb.count({artist: name}, function (err, count) {
        artist['title_count'] = count;
        callback(artist);
      });
    });
  }

  findAtPath(path, callback) {
    this.musicdb.findOne({path: path}, function (err, doc) {
      if (err) console.error(err);
      else callback(doc);
    });
  }

  addArtist(artist) {
    var artistdb = this.artistdb;
    if (artist.constructor === Array) artist = artist[0];

    this.artistdb.update({name: artist},
      {type: 'artist', name: artist},
      {upsert: true}, function (err) {
      if (err) console.error(err);
    });
    
  }

  removeTriggerArtist(artist) {
  }

  addMediafile(mediafile) {
    this.musicdb.insert(mediafile, function (err) {
        if (err) console.error(err);
        process.emit('mediaFileAdd', mediafile);
    });

    if (mediafile.artist) this.addArtist(mediafile.artist);
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

  searchField(field, terms, callback) {
    let results = new Results();
    let count = 0;
    for (let term of terms) {
      let sobj = {};
      sobj[field] = regex(term);
      this.musicdb.find(sobj, ATTRIBUTE_MASK, function (err, docs) {
        if (err) console.error(err);
        results.add(docs);
        count++;
        if (count >= terms.length) {
          callback(results.toArray());
        }
      });
    }
  }

  searchArtist(terms, callback) {
    var results = new Results();
    var count = 0;
    for (let term of terms) {
      this.artistdb.find({name: regex(term)}, function (err, docs) {
        console.log(docs);
        results.add(docs);
        count++;
        if (count >= terms.length) {
          callback(results.toArray());
        }
      })
    }
  }

  search(query, callback) {
    let terms = query.split(' ');
    let results = {};
    let count = 0;

    function addToResults(field, subresults) {
      if (subresults.length > 0) {
        results[field + 's'] = subresults.slice(0,10);
      }
      count++;
      if (count === FIELDS.length && callback) {
        callback(results);
      }
    }
    for (let field of FIELDS) {
      switch (field) {
      case 'artist':
        this.searchArtist(terms, function (r) {
          addToResults(field, r);
        });
        break;

      default:
        this.searchField(field, terms, function (r) {
          addToResults(field, r);
        });
      }
    }
  }

  random(callback) {
    this.musicdb.find({}, ATTRIBUTE_MASK).limit(20).exec(function (err, docs) {
      if (err) console.error(err);
      else callback({titles: docs});
    })
  }
}

module.exports = Library;
