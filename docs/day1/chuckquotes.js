// async function getJoke() {
//   const res   = await fetch( `https://api.chucknorris.io/jokes/random` );
  
//   const json  = await res.json();
  
//   document.getElementById('text').innerHTML = json.value;
  
//   document.getElementById('author').innerHTML = "<img src='" + json.icon_url + "'>";
// }

var currentJoke         = null;
var selectedLang;
var selectedLangId      = 'en-US';
var selectedVoice       = null;
var synth               = window.speechSynthesis;
var voices              = [];
var voicesPopulated     = false;

function populateVoiceList() {
  if ( voicesPopulated )  return;

  voicesPopulated = true
  voices          = synth.getVoices();

  createFlagButtonsFromVoiceOrigins( voices );

  selectedVoice  = voices[ 0 ];

  getJoke();
}

if ( speechSynthesis.onvoiceschanged !== undefined ) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function createFlagButtonsFromVoiceOrigins( voices ) {
  let flagAttrs = voices.map(( voice, voices ) => {
    let lang	= voice.lang.split( '-' );
    var selectedLang;
    
    if ( lang.length === 2 ) {
      selectedLang	= lang[ 1 ].toLowerCase();
      } else {
      selectedLang	= 'us';
      }

    return {
      className	: `flag flag-${selectedLang}`,
      voice		: voice.name,
      lang    : voice.lang
    };
  });

  // create a flag button for each language
  flagAttrs.forEach(( flag ) => {
    var newEle  = $(`
      <a class='speak ${flag.lang}'>
        <img src="./blank.gif" class="${flag.className}" alt="${flag.voice}" />
      </a>
    `);

    newEle.on('mousedown', function( btn ) {
      selectedLangId  = btn.currentTarget.classList[ 1 ] || selectedLangId;
      speak( selectedLangId );
    })
    
    $( '#quote-box' ).append( newEle );
  })
}

function speak( langId ) {
  selectedVoice  = voices.filter((voice) => voice.lang === langId)[0];
    
  var utterThis   = new SpeechSynthesisUtterance( currentJoke );
  utterThis.voice = selectedVoice;
  utterThis.pitch = 1;
  utterThis.rate  = 1;

  synth.speak( utterThis );
}

function getJoke() {
  $.get( 'https://api.chucknorris.io/jokes/random', function( data ) {
    
    currentJoke = data.value;
    
    $('#text').html( currentJoke );
    $('#author').html( data.id );

    speak( selectedLangId );
  })
}

// doesn't pass test, but 'click' is triple firing
// TODO: brush up on jQuery API and refactor this
$( '#new-quote' ).on('mousedown', getJoke);