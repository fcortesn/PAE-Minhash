import { Minhash, LshIndex } from 'minhash';
const fsModule = require('./fsModule');

const fs = new fsModule('enrichedSongs');

function getSignature(lyrics, shingleSize, hashFunctions) {
    var text = lyrics.toLowerCase().replace(/\.|\,|\;|\(|\)|\[.*\]/g, "");
    text = text.replace(/\s+/g, " ");
    text = text.split(" ");

    var shingles = [];

    for (let i=0; i<text.length / shingleSize; i++) {
        var start = i * shingleSize;
        var end = start + shingleSize;
        var shingle = text.slice(start, end);
        shingles.push(shingle.join(' '));
    };

    var m1 = new Minhash({numPerm: hashFunctions, seed: 1});
    shingles.map(function(w) { m1.update(w) });
    return m1.hashvalues;
}

(function changeSignature(shingleSize, hashFunctions) {
    var songs = fs.readSongs();
    songs.forEach(songName => {
        let song =JSON.parse(fs.readFile(songName));
        song.signature = getSignature(song.lyrics, shingleSize, hashFunctions);
        fs.writeFile(song);
    });
})(3, 1024);