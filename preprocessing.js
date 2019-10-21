import { Minhash, LshIndex } from 'minhash';
const fs = require('fs');

var songLyrics = [];

var songs = fs.readdirSync('./songs/');
songs.forEach(song => {
  let text = fs.readFileSync(`./songs/${song}`, 'utf8', function(err, data) {
    return data;
  });

  text = text.toLowerCase().replace(/\.|\,|\;|\'/g, "");
  text = text.replace(/\s/g, " ");
  text = text.split(" ");

  var shingles = [];
  var shingleSize = 3; 

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
    var m1 = new Minhash({numPerm: 4, seed: 1});
    song.shingles.map(function(w) { m1.update(w) });
    song.signature = m1.hashvalues;
    index.insert(song.songName, {hashvalues: song.signature});
});

songLyrics.forEach(song => {
    console.log(song.songName)
    console.log(song.signature);
})

songLyrics.forEach(song => {    
    console.log(`Songs similar to "${song.songName}": [${index.query({hashvalues: song.signature})}]`);
});