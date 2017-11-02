/**
 * Helper script to check if URLS are still valid
 * Usage: node check_urls.js
 */

var http = require('http');
var urllib = require('url');

// load playlist.js
require('./public_html/playlist.js');

function check_url(url) {
  var q = urllib.parse(url, true);
  options = {
    method: 'HEAD',
    host: q.host,
    port: 80,
    path: q.pathname,
    followAllRedirects: true,
  },
  req = http.request(options, function(r) {
    if (r.headers.location) {
      check_url(r.headers.location);
    } else {
      console.log(`${r.statusCode}: ${url}`);
      // console.log(JSON.stringify((r.headers)));
    }
  });
  req.end();
}


// check the headers of each URL
//console.log(PLAYLIST);

var keys = [];
for (var key in PLAYLIST)
  keys.push(key);

var tracks = [];
for (var i = 0; i < keys.length; i++) {
  tracks = tracks.concat(PLAYLIST[keys[i]]);
}

tracks.map(t => check_url(t.file));
