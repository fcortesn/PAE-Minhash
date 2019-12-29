function fsModule(folder) {
    const fs = require('fs');
    
    this.readSongs = function () {
        return fs.readdirSync(`./${folder}`);
    }

    this.readFile = function (songName) {
        return fs.readFileSync(`./${folder}/${songName}`, 'utf8', function(err, data) {
            return data;
        });
    }

    this.writeFile = function (song) {
        fs.writeFile(`./enrichedSongs/${song.name}`, JSON.stringify(song), function (err) {
            if (err) throw err;
        });
    }
}

module.exports = fsModule;