import { LshIndex } from 'minhash';
const fsModule = require('./fsModule');

const fs = new fsModule('enrichedSongs');
const index = new LshIndex({bandSize: 2});

function getMatches(songs) {
    var matches = {};
    songs.forEach(song => {
        let queryResult = index.query({hashvalues: song.signature});
        if (queryResult.length > 1) {
            for (let i = 0; i < queryResult.length; i++){
                if (song.title === queryResult[i]) {
                    continue;
                }

                if (matches[queryResult[i]]) {
                    continue;
                } else {
                    if (matches[song.title]) {
                        matches[song.title].push(queryResult[i]);
                    } else {
                        matches[song.title] = [queryResult[i]];
                    }
                }
            }
        }
    });

    return matches;
}


(function queryBySentiments(sentiment1, sentiment2) {
    const songs = fs.readSongs();
    let songs1 = [];
    let songs2 = [];

    songs.forEach(songName => {
        let song = JSON.parse(fs.readFile(songName));

        if (song.sentiment.indexOf(sentiment1) > -1) {
            songs1.push(song);
            index.insert(song.title, {hashvalues: song.signature});
        }

        if (sentiment2 && song.sentiment.indexOf(sentiment2) > -1) {
            songs2.push(song);
            index.insert(song.title, {hashvalues: song.signature});
        }
    });

    var result;

    if (sentiment2) {
        result = getMatches(songs2);
    } else {
        result = getMatches(songs1);
    }

    console.log(result);

})("anger", "tentative");