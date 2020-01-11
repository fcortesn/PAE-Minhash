const fs = require('fs');
const fsModule = require('./fsModule');

const fse = new fsModule('enrichedSongs');

(function setGenre() {
    const songFolders = fs.readdirSync('./songs');

    songFolders.forEach(genre => {
        let songsFolder = fs.readdirSync(`./songs/${genre}`);

        songsFolder.forEach(songName => {
            songName = songName.replace(/\.txt/g, "");
            let song = fse.readFile(songName);
            song = JSON.parse(song);
            song.genre = genre;
            fs.writeFile(`./enrichedSongs/${song.title}`, JSON.stringify(song), function (err) {
                if (err) throw err;
            });
        });
    });

})();