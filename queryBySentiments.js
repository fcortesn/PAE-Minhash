import { LshIndex } from 'minhash';
const fsModule = require('./fsModule');

const fs = new fsModule('enrichedSongs');
const index = new LshIndex({bandSize: 2});

function getMatches(songs, sentiment) {
    var matches = {};
    var count = 0;

    songs.forEach(song => {
        let queryResult = index.query({hashvalues: song.signature});
        if (queryResult.length > 1) {
            for (let i = 0; i < queryResult.length; i++){
                if (`${song.title}#${sentiment}` === queryResult[i] || song.title === queryResult[i].split('#')[0]) {
                    continue;
                }

                if (matches[song.title] && queryResult[i].split('#')[1] !== sentiment) {
                    matches[song.title].push(queryResult[i].split('#')[0]);
                    count++;
                } else if(queryResult[i].split('#')[1] !== sentiment){
                    matches[song.title] = [queryResult[i].split('#')[0]];
                    count++;
                }
            }
        }
    });

    console.log(count);

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
            index.insert(`${song.title}#${sentiment1}`, {hashvalues: song.signature});
        }

        if (sentiment2 && song.sentiment.indexOf(sentiment2) > -1) {
            songs2.push(song);
            index.insert(`${song.title}#${sentiment2}`, {hashvalues: song.signature});
        }
    });

    var result;

    if (sentiment2) {
        result = getMatches(songs2, sentiment2);
    } else {
        result = getMatches(songs1, sentiment1);
    }

    // console.log(result);

})("anger", "tentative");