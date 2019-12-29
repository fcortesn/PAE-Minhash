function toneAnalyzer() {
    const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
    var api;

    this.init = function () {
        api = new ToneAnalyzerV3({
            version: '2017-09-21',
            iam_apikey: 'FgkkhHi_8VF4X-ON3EEQlZh9VW2A-OvKV_topUyenTAG',
            url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
            disable_ssl_verification: true
        });
    }

    this.analyze = function (songLyrics) {
      var toneParams = {
        tone_input: { 'text': songLyrics },
        content_type: 'application/json',
      };

      return api.tone(toneParams);
    }
}

module.exports = toneAnalyzer;