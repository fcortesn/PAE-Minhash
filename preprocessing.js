import { Minhash, LshIndex } from 'minhash';
const fs = require('fs');

var songLyrics = [];

var songs = fs.readdirSync('./songs/');
songs.forEach(song => {
  let text = fs.readFileSync(`./songs/${song}`, 'utf8', function(err, data) {
    return data;
  });

  text = text.toLowerCase().replace(/\.|\,|\;|\'|\[.*\]/g, "");
  text = text.replace(/\s/g, " ");
  text = text.split(" ");

  var shingles = [];
  var shingleSize = 2; 

  for (let i=0; i<text.length / shingleSize; i++) {
    var start = i * shingleSize;
    var end = start + shingleSize;
    var shingle = text.slice(start, end);
    shingles.push(shingle.join(' '));
  };
  
  songLyrics.push({
      songName: song.replace(/\.txt/g, ""),
      shingles: shingles
  });
});

var index = new LshIndex({bandSize: 2});
songLyrics.forEach(song => {
    var m1 = new Minhash({numPerm: 256, seed: 1});
    song.shingles.map(function(w) { m1.update(w) });
    song.signature = m1.hashvalues;
    index.insert(song.songName, {hashvalues: song.signature});
});

var matches = {};
var count = 0;

songLyrics.forEach(song => {    
    let queryResult = index.query({hashvalues: song.signature});
    if (queryResult.length > 1) {
        for (let i = 0; i < queryResult.length; i++){
            if (song.songName === queryResult[i]) {
                continue;
            }
            if (matches[queryResult[i]]) {
                continue;
            } else {
                if (matches[song.songName]) {
                    matches[song.songName].push(queryResult[i]);
                    count++;
                } else {
                    matches[song.songName] = [queryResult[i]];
                    count++;
                }
                
            }        
        }
    }
});

console.log(matches);
console.log(count);

