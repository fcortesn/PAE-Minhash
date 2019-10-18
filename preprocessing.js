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
  
  for (let i=0; i<text.length / 3; i++) {
    var start = i * 3;
    var end = start + 3;
    var shingle = text.slice(start, end);
    shingles.push(shingle.join(' '));
  };
  
  songLyrics.push({
      song: song.replace(/\.txt/g, ""),
      shingles: shingles
  });
});

var index = new LshIndex({bandSize: 1});
songLyrics.forEach(song => {
    var m1 = new Minhash();
    song.shingles.map(function(w) { m1.update(w) });
    song.signature = m1.hashvalues;
    index.insert(song.song, {hashvalues: song.signature});
});

songLyrics.forEach(song => {
    console.log('Jaccard similarity >= 0.5 to m1:', index.query({hashvalues: song.signature}));
});