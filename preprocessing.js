import { Minhash } from 'minhash';
const fsModule = require('./fsModule');
const toneAnalyzer = new require('./tone');

const fs = new fsModule('tests');
const toneAPI = new toneAnalyzer();
toneAPI.init();

function getSignature(lyrics) {
    var text = lyrics.toLowerCase().replace(/\.|\,|\;|\(|\)|\[.*\]/g, "");
    text = text.replace(/\s+/g, " ");
    text = text.split(" ");

    var shingles = [];
    var shingleSize = 2; 

    for (let i=0; i<text.length / shingleSize; i++) {
        var start = i * shingleSize;
        var end = start + shingleSize;
        var shingle = text.slice(start, end);
        shingles.push(shingle.join(' '));
    };

    var m1 = new Minhash({numPerm: 2048, seed: 1});
    shingles.map(function(w) { m1.update(w) });
    return m1.hashvalues;
}

(function preprocessing() {
    var songs = fs.readSongs();
    songs.forEach(song => {
        let newSong = {
            title: song
        };

        newSong.lyrics = fs.readFile(song);
        newSong.signature = getSignature(newSong.lyrics);
        newSong.title = newSong.title.replace(/\.txt/g, "");
        newSong.sentiment = [];

        toneAPI.analyze(newSong.lyrics).then(toneAnalysis => {
            toneAnalysis.document_tone.tones.forEach(tone => {
                newSong.sentiment.push(tone.tone_id);
            });
            
            fs.writeFile(newSong);
        })
        .catch(err => {
            console.log('error:', err);
        });
    });
})();



// text = text.toLowerCase().replace(/\.|\,|\;|\(|\)|\[.*\]/g, "");
// text = text.replace(/\s+/g, " ");
// text = text.split(" ");

// var shingles = [];
// var shingleSize = 2; 

// for (let i=0; i<text.length / shingleSize; i++) {
//     var start = i * shingleSize;
//     var end = start + shingleSize;
//     var shingle = text.slice(start, end);
//     shingles.push(shingle.join(' '));
// };

// songLyrics.push({
//     songName: song.replace(/\.txt/g, ""),
//     shingles: shingles
// });

// var index = new LshIndex({bandSize: 1});
// songLyrics.forEach(song => {
//     var m1 = new Minhash({numPerm: 2048, seed: 1});
//     song.shingles.map(function(w) { m1.update(w) });
//     song.signature = m1.hashvalues;
//     index.insert(song.songName, {hashvalues: song.signature});
// });

// var index = new LshIndex({bandSize: 1});
// songLyrics.forEach(song => {
//     var m1 = new Minhash({numPerm: 2048, seed: 1});
//     song.shingles.map(function(w) { m1.update(w) });
//     song.signature = m1.hashvalues;
//     index.insert(song.songName, {hashvalues: song.signature});
// });

// var matches = {};
// var count = 0;

// songLyrics.forEach(song => {    
//     let queryResult = index.query({hashvalues: song.signature});
//     if (queryResult.length > 1) {
//         for (let i = 0; i < queryResult.length; i++){
//             if (song.songName === queryResult[i]) {
//                 continue;
//             }
//             if (matches[queryResult[i]]) {
//                 continue;
//             } else {
//                 if (matches[song.songName]) {
//                     matches[song.songName].push(queryResult[i]);
//                     count++;
//                 } else {
//                     matches[song.songName] = [queryResult[i]];
//                     count++;
//                 }
                
//             }        
//         }
//     }
// });

// // console.log(matches);
// console.log(count);

