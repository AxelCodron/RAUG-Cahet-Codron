// File to manage all the sounds in the game

import * as THREE from 'three';

// ------------------- Variables -------------------

// Listener and audio loader
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

// Background music
const exteriorBackgroundMusic = new THREE.Audio(listener);
audioLoader.load('assets/sounds/abadoned-pyramid-atmo-orchestral-and-drone-sad-mood-9237.mp3', (buffer) => {
    exteriorBackgroundMusic.setBuffer(buffer);
    exteriorBackgroundMusic.setLoop(true);
    exteriorBackgroundMusic.setVolume(0.1);
});

const meetingBrotherMusic = new THREE.Audio(listener);
audioLoader.load('assets/sounds/a-rainy-day-248712.mp3', (buffer) => {
    meetingBrotherMusic.setBuffer(buffer);
    meetingBrotherMusic.setLoop(true);
    meetingBrotherMusic.setVolume(0.2);
});

// Sound effects
const scaryViolins = new THREE.Audio(listener);
audioLoader.load('assets/sounds/scaryviolins-6829.mp3', (buffer) => {
    scaryViolins.setBuffer(buffer);
    scaryViolins.setLoop(true);
    scaryViolins.setVolume(0.8);
});

const shepardTone = new THREE.Audio(listener);
audioLoader.load('assets/sounds/shepard-effect-edit.mp3', (buffer) => {
    shepardTone.setBuffer(buffer);
    shepardTone.setLoop(true);
    shepardTone.setVolume(0.6);
});

const biteScarySound = new THREE.Audio(listener);
audioLoader.load('assets/sounds/cringe-scare-47561.mp3', (buffer) => {
    biteScarySound.setBuffer(buffer);
    biteScarySound.setVolume(0.2);
});

const biteSound = new THREE.Audio(listener);
audioLoader.load('assets/sounds/zombie-bite-96528.mp3', (buffer) => {
    biteSound.setBuffer(buffer);
    biteSound.setVolume(0.5);
});

const paperSound = new THREE.Audio(listener);
audioLoader.load('assets/sounds/paper-245786.mp3', (buffer) => {
    paperSound.setBuffer(buffer);
    paperSound.setVolume(0.5);
});

const doorSound = new THREE.Audio(listener);
audioLoader.load('assets/sounds/closing-metal-door-44280.mp3', (buffer) => {
    doorSound.setBuffer(buffer);
    doorSound.setVolume(0.5);
});

const lockedDoorSound = new THREE.Audio(listener);
audioLoader.load('assets/sounds/door-close-79921.mp3', (buffer) => {
    lockedDoorSound.setBuffer(buffer);
    lockedDoorSound.setVolume(0.4);
});

const corpseNoise = new THREE.Audio(listener);
audioLoader.load('assets/sounds/dropping-bag-95101.mp3', (buffer) => {
    corpseNoise.setBuffer(buffer);
    corpseNoise.setVolume(0.5);
});

const footsteps = new THREE.Audio(listener);
audioLoader.load('assets/sounds/footsteps.mp3', (buffer) => {
    footsteps.setBuffer(buffer);
    footsteps.setVolume(0.4);
    footsteps.setLoop(true);
});

// Positionnal sound effects
const infectedSound = new THREE.PositionalAudio(listener);
audioLoader.load('assets/sounds/zombie-1-22336.mp3', (buffer) => {
    infectedSound.setBuffer(buffer);
    infectedSound.setLoop(true);
    infectedSound.setRefDistance(20);
    infectedSound.setVolume(0.3);
});

const lampSound = new THREE.PositionalAudio(listener);
audioLoader.load('assets/sounds/fluorescent-lamp-flickering-17625.mp3', (buffer) => {
    lampSound.setBuffer(buffer);
    lampSound.setRefDistance(3);
    lampSound.setVolume(0.9);
    lampSound.setLoop(true);
});

// ------------------- Functions -------------------

function addListenerToCamera(camera) {
    camera.add(listener);
}

function addSoundToInfected(infected) {
    infected.add(infectedSound);
}

function addSoundToLamp(lamp) {
    lamp.add(lampSound);
    lampSound.play();
}

function playExteriorBackgroundMusic() {
    exteriorBackgroundMusic.play();
}

function playMeetingBrotherMusic() {
    meetingBrotherMusic.play();
}

function playInfectedSound() {
    infectedSound.play();
}

function stopBackgroundMusic() {
    exteriorBackgroundMusic.stop();
    meetingBrotherMusic.stop();
    infectedSound.stop();
}

function playBiteSound() {
    biteSound.play();
    biteScarySound.play();
}

function playInfectedChase() {
    stopBackgroundMusic();
    scaryViolins.play();
    shepardTone.play();
    infectedSound.play();
}

function stopInfectedChase() {
    scaryViolins.stop();
    shepardTone.stop();
    infectedSound.stop();
    playBiteSound();
    playExteriorBackgroundMusic();
}

function playPaperSound() {
    paperSound.play();
}

function playDoorSound() {
    doorSound.play();
}

function playLockedDoorSound() {
    lockedDoorSound.play();
}

function playCorpseNoise() {
    corpseNoise.play();
}

function playFootsteps() {
    if (!footsteps.isPlaying) {
        footsteps.play();
    }
}

function pauseFootsteps() {
    footsteps.pause();
}

// ------------------- Export -------------------

export {
    addListenerToCamera, playExteriorBackgroundMusic, stopBackgroundMusic,
    playInfectedChase, stopInfectedChase, playBiteSound, addSoundToInfected, playPaperSound,
    playDoorSound, playLockedDoorSound, playCorpseNoise, playFootsteps, pauseFootsteps,
    addSoundToLamp, playMeetingBrotherMusic, playInfectedSound
};