const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: 'FgkkhHi_8VF4X-ON3EEQlZh9VW2A-OvKV_topUyenTAG',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
  disable_ssl_verification: true
}); 

var text = `I Caught a glimpse of your light
When I was empty inside
And through the nothingness
I found this world

I'll wander calling your name
Until the end of my days
'Til I find the answer

Yeah
Right through my fingers
I'm losing the light
Why can't I ever do anything right?
This is the time
Throw it aside
Take all your scars
And just leave them behind
I'm gonna through it
Dead or alive
But on my own
I cannot survive

I don't wanna lie to myself
Keep on the fight that's right
I'll never lose and cry
Keep running day and night
It's time to rewrite
No matter what anyone says
I'll find my way

Never go away
Never go away

Now
Nobody can stop me no way
That promise is engraved in my memory
We'll take it back you just watch
Everything that we lost
Rise up in this world
(Never looking back yeah)

The end of our journey is on repeat
But I won't let it stand between you and me
What are you fighting for
Cause it's not over
Rise up in this world

Now I know it's obvious what I need to do
Keeping to my world fighting all the way through
In the dark
Searching for an answer
No one is balanced
No one is forced
To fight without seeing reality
Is a short life even worth it to live for me?
Change the world and I know what for
Chase my dream fight my war

Keep on the fight that's right
I'll never lose and cry
Keep running day and night
It's time to rewrite
No matter what anyone says
I'll find my way

Never go away
Never go away

Now
Nobody can stop me no way
We've gotta keep a hold on the vow we made
And no matter the cost
Regain all we lost
Rise up in this world
(Never looking back yeah)

I'm rising like a phoenix a hundred times
My whole life on the line
I will chase that light
I know my soul it won't fray
It'll never fade
Rise up in this world

I gotta go
I'll defend this world on my own
(Yeah on my own)
I gotta go
I'll defend this world on my own

Don't be fazed you gotta find the light
Gonna be up to you if you gotta stand and fight
If you're fighting in the day
You gotta battle in the night
And ain't nobody gonna tell you if it's wrong or right
Shield up to my dilemma
Send the guards here they come
They can
Stay
Hungry
Stay
Foolish
And no matter what you've got let's go
Never go away
Now

Nobody can stop me no way
That promise is engraved in my memory
We'll take it back you just watch
Everything that we lost
Rise up in this world
(Never looking back yeah)

The end of our journey is on repeat
But I won't let it stand between you and me
What are you fighting for
Cause it's not over
Rise up in this world`;


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
    
  })
  .catch(err => {
    console.log('error:', err);
  });