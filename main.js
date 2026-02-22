const soundboard = document.querySelector('.soundboard');

// build soundboard
const centerIndex = 12;
for (let i = 0; i < 25; i++) {
    const osc = document.createElement('div');
    osc.classList.add('osc');
    osc.id = i;
    osc.addEventListener('mouseover', playNote);
    if (i == centerIndex) {
        osc.classList.add('center');
        const imageOverlay = document.createElement('div');
        imageOverlay.classList.add('image-overlay');
        osc.appendChild(imageOverlay)
    }
    soundboard.appendChild(osc);
}

// beginGame
let context;
let oscillator;
let compressor;

document.addEventListener('click', beginGame);
document.addEventListener('keydown', beginGame);

function beginGame() {
    context = new AudioContext();

    compressor = context.createDynamicsCompressor();

    compressor.ratio.setValueAtTime(20, context.currentTime);
    // compressor.attack.setValueAtTime(0.003, context.currentTime);
    // compressor.release.setValueAtTime(0.5, context.currentTime);
    // compressor.knee.setValueAtTime(30, context.currentTime);

    compressor.connect(context.destination);

    document.getElementById('popup').style.display = 'none';
    document.removeEventListener('click', beginGame);
    document.removeEventListener('keydown', beginGame);
}



function playNote(event) {
    if (!context) return; // don't do stuff until setup is complete

    const now = context.currentTime;

    oscillator = context.createOscillator();
    gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(compressor);

    // pitch and timbre
    oscillator.type = "square";
    oscillator.frequency.value = melody[needle % melody.length];
    needle++;

    // envelope
    attack = 0.03;
    release = 0.75;
    duration = attack + release;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + attack);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    // play audio
    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);

    // change osc color
    let currentColor = window.getComputedStyle(event.target).backgroundColor;
    let newColor;
    do {
        newColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]

    } while (newColor === event.target.dataset.lastColor)
    event.target.style.setProperty('--c', newColor);
    event.target.style.border = "none";

    const el = event.currentTarget;
    el.classList.remove('pulsing');
    void el.offsetWidth;
    el.classList.add('pulsing');

    // set new color as most 'lastColor' for the comparison above the
    // next time this function is called
    event.target.dataset.lastColor = newColor;
}

// the record needle position
let needle = 0;

// Bb minor scale in solfege
const te0 = 415.3;
const doe = 466.2;
const re = 523.3;
const me = 554.4;
const fa = 622.3;
const so = 698.5;
const le = 740;
const te = 830.6;

// Guess what it is
const melody = [
    doe, re, me, me, fa, re, doe, te0,
    doe, doe, re, me, doe, te, te, fa,
    doe, doe, re, me, me, fa, re, doe, te0,
    doe, doe, re, me, doe, fa, fa, fa, so, fa,
    me, fa, so, me, fa, fa, fa, so, fa, te0,
    doe, re, me, doe, fa, so, fa,
    te0, doe, me, doe, so, so, fa,
    te0, doe, me, doe, fa, fa, me,
    te0, doe, me, doe, me, fa, re, doe, te0, fa, me,
    te0, doe, me, doe, so, so, fa,
    te0, doe, me, doe, te, re, me,
    te0, doe, me, doe, me, fa, re, doe, te0, fa, me 
]

// color palette for visual excitement
const colorPalette = [
    '#E8812D',
    '#783C3F',
    '#DD7C9C',
    '#8694DA',
    '#354D89',
    '#263753',
    '#D4C1B3',
    '#BEBDCA',
    '#E2C2E9',
    '#BA8A6F',
    '#CE393B',
    '#A5C96C',
    '#B9D0FF',
    '#DC7118',
    '#E54C05',
    '#FDBA9B',
    '#4F6DBA'
]