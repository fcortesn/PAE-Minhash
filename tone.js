const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const fs = require('fs');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: 'FgkkhHi_8VF4X-ON3EEQlZh9VW2A-OvKV_topUyenTAG',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
  disable_ssl_verification: true
}); 

var songs = fs.readdirSync('./songs/');
songs.forEach(song => {
  let text = fs.readFileSync(`./songs/${song}`, 'utf8', function(err, data) {
    return data;
  });

  const toneParams = {
    tone_input: { 'text': text },
    content_type: 'application/json',
  };

  toneAnalyzer.tone(toneParams)
  .then(toneAnalysis => {
    var tones = toneAnalysis.document_tone.tones;
    tones.forEach(tone => {
        console.log(`The document has ${tone.tone_name} sentiment with a score of: ${tone.score}`);        
    });

    fs.writeFile(`./sentiments/${song}`, JSON.stringify(toneAnalysis), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    
  })
  .catch(err => {
    console.log('error:', err);
  });

});