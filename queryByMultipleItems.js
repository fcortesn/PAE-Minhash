import { LshIndex } from 'minhash';
const fsModule = require('./fsModule');

const fs = new fsModule('enrichedSongs');
const index = new LshIndex({bandSize: 2});

function getMatches(songs) {
    var matches = {};
    var count = 0;

    songs.forEach(song => {
        let queryResult = index.query({hashvalues: song.signature});
        if (queryResult.length > 1) {
            for (let i = 0; i < queryResult.length; i++){
                if (`${song.title}#${song.genre}` === queryResult[i]) {
                    continue;
                }

                if (matches[song.title] && queryResult[i].split('#')[1] !== song.genre) {
                    matches[song.title].push(queryResult[i].split('#')[0]);
                    count++;
                } else if(queryResult[i].split('#')[1] !== song.genre) {
                    matches[song.title] = [queryResult[i].split('#')[0]];
                    count++;
                }
            }
        }
    });

    console.log(count);

    return matches;
}


(function queryByMultipleItems(genre1, genre2, sentiment1, sentiment2) {
    const songs = fs.readSongs();
    let songs1 = [];
    let songs2 = [];

    songs.forEach(songName => {
        let song = JSON.parse(fs.readFile(songName));

        if (song.genre === genre1 && song.sentiment.indexOf(sentiment1) > -1) {
            songs1.push(song);
            index.insert(`${song.title}#${song.genre}`, {hashvalues: song.signature});
        }

        if (song.genre === genre2 && song.sentiment.indexOf(sentiment2) > -1) {
            songs2.push(song);
            index.insert(`${song.title}#${song.genre}`, {hashvalues: song.signature});
        }
    });

    var result = getMatches(songs2);

    // console.log(result);

})("Pop", "Metal", "joy", "sadness");