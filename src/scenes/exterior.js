// File for the exterior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';
import { clearCode, useCode } from '../utils/digits-code';
import { addSoundToLamp, playCorpseNoise, playDoorSound, playLockedDoorSound, playPaperSound } from '../utils/sounds';

// ------------------- Variables -------------------

// Flag to track if the door key has been found
let doorKeyFound = false;

// Flags to track if player is inside the trigger
let playerInDoorTriggerZone = false;
let playerInCorpseTriggerZone = false;
let playerInCodeTriggerZone = false;
let playerInFileTriggerZone = false;
let playerInReportTriggerZone = false;
let playerInCharlesNoteTriggerZone = false;

// Door trigger
const doorTrigger = new THREE.Box3(
    // Min corner (xMin, yMin, zMin)
    new THREE.Vector3(-7.55, 0, -5.5),
    // Max corner (xMax, yMax, zMax)
    new THREE.Vector3(-5, 3, 0.5)
);

const corpseTrigger = new THREE.Box3(
    new THREE.Vector3(-31, 0, -28),
    new THREE.Vector3(-29, 3, -24)
);

// Code trigger
const codeTrigger = new THREE.Box3(
    new THREE.Vector3(-37, 0, 0),
    new THREE.Vector3(-33, 3, 3.5)
);

// File trigger
const fileTrigger = new THREE.Box3(
    new THREE.Vector3(-13, 0, -60),
    new THREE.Vector3(-10.5, 3, -57)
);

// Report trigger
const reportTrigger = new THREE.Box3(
    new THREE.Vector3(-8, 0, -10),
    new THREE.Vector3(-5, 3, -7.5)
);

// Charles note trigger
const charlesNoteTrigger = new THREE.Box3(
    new THREE.Vector3(-22, 0, 0.6),
    new THREE.Vector3(-19, 3, 3.5)
);

// -------------------------------- GUI --------------------------------

// Texts for interactions
const doorText = document.getElementById('door-text');
const corpseText = document.getElementById('corpse-text');
const fileText = document.getElementById('file-text');
const reportText = document.getElementById('report-text');
const charlesNoteText = document.getElementById('charles-note-text');
const codeText = document.getElementById('code-text');
const exitPrompt = document.getElementById('exit-prompt');

// Examines
const doorExam = document.getElementById('door-exam');
const corpseExam = document.getElementById('corpse-exam');

// Images
const corpseTimeline = document.getElementById('corpse-timeline');
const report = document.getElementById('report');
const charlesNote = document.getElementById('charles-note');
const fadedScreen = document.getElementById('faded-screen');

// Ensure the images are hidden by default
corpseTimeline.style.visibility = "hidden";
report.style.visibility = "hidden";
charlesNote.style.visibility = "hidden";

// Function called when the player interacts with "E"
function interact() {
    if (playerInDoorTriggerZone) {
        if (doorKeyFound) {
            hideDoorText();
            playDoorSound();
            loadNewRoom("reception");
            playerInDoorTriggerZone = false;
        }
        else {
            playLockedDoorSound();
            showDoorExam();
        }
    }
    if (playerInCorpseTriggerZone) {
        playCorpseNoise();
        showCorpseExam();
    }
    if (playerInFileTriggerZone) {
        if (corpseTimeline.style.visibility === "hidden") {
            playPaperSound();
            showFile();
            hideFileText();
            showExitPrompt();
        }
        else {
            hideFile();
            showFileText();
            hideExitPrompt();
        }
    }
    if (playerInReportTriggerZone) {
        if (report.style.visibility === "hidden") {
            playPaperSound();
            showReport();
            hideReportText();
            showExitPrompt();
        }
        else {
            hideReport();
            showReportText();
            hideExitPrompt();
        }
    }
    if (playerInCharlesNoteTriggerZone) {
        if (charlesNote.style.visibility === "hidden") {
            playPaperSound();
            showCharlesNote();
            hideCharlesNoteText();
            showExitPrompt();
        }
        else {
            hideCharlesNote();
            showCharlesNoteText();
            hideExitPrompt();
        }
    }
}

// Prompt the player to exit the game
function showExitPrompt() {
    exitPrompt.style.display = "block";
}

function hideExitPrompt() {
    exitPrompt.style.display = "none";
}

// Door functions
function showDoorExam() {
    doorExam.style.visibility = "visible";
}

function hideDoorExam() {
    doorExam.style.visibility = "hidden";
}

function showDoorText() {
    doorText.style.visibility = "visible";
}

function hideDoorText() {
    doorText.style.visibility = "hidden";
}

// Corpse functions
function showCorpseExam() {
    corpseExam.style.visibility = "visible";
}

function hideCorpseExam() {
    corpseExam.style.visibility = "hidden";
}

function showCorpseText() {
    corpseText.style.visibility = "visible";
}

function hideCorpseText() {
    corpseText.style.visibility = "hidden";
}

// File functions
function showFile() {
    corpseTimeline.style.visibility = "visible";
    fadedScreen.style.visibility = "visible";
}

function hideFile() {
    corpseTimeline.style.visibility = "hidden";
    fadedScreen.style.visibility = "hidden";
}

function showFileText() {
    fileText.style.visibility = "visible";
}

function hideFileText() {
    fileText.style.visibility = "hidden";
}

// Report functions
function showReport() {
    report.style.visibility = "visible";
    fadedScreen.style.visibility = "visible";
}

function hideReport() {
    report.style.visibility = "hidden";
    fadedScreen.style.visibility = "hidden";
}

function showReportText() {
    reportText.style.visibility = "visible";
}

function hideReportText() {
    reportText.style.visibility = "hidden";
}

// Charles note functions
function showCharlesNote() {
    charlesNote.style.visibility = "visible";
    fadedScreen.style.visibility = "visible";
}

function hideCharlesNote() {
    charlesNote.style.visibility = "hidden";
    fadedScreen.style.visibility = "hidden";
}

function showCharlesNoteText() {
    charlesNoteText.style.visibility = "visible";
}

function hideCharlesNoteText() {
    charlesNoteText.style.visibility = "hidden";
}

// Code functions
function showCodeText() {
    codeText.style.visibility = "visible";
}

function hideCodeText() {
    codeText.style.visibility = "hidden";
}

function removeCodeTrigger() {
    codeTrigger.makeEmpty();
}

// ------------------- Functions -------------------

// Function called when the player finds the door key
function getKey() {
    doorKeyFound = true;
}

// Triggers function
function exteriorTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(doorTrigger)) {
        if (!playerInDoorTriggerZone) {
            console.log("Entered the door trigger zone");
            showDoorText();
            playerInDoorTriggerZone = true;
        }
    }
    else {
        if (playerInDoorTriggerZone) {
            console.log("Exited the door trigger zone");
            hideDoorText();
            hideDoorExam();
            hideExitPrompt();
            playerInDoorTriggerZone = false;
        }
    }

    // Check for corpse trigger collision
    if (playerBox.intersectsBox(corpseTrigger)) {
        if (!playerInCorpseTriggerZone) {
            console.log("Entered the corpse trigger zone");
            showCorpseText();
            playerInCorpseTriggerZone = true;
        }
    }
    else {
        if (playerInCorpseTriggerZone) {
            console.log("Exited the corpse trigger zone");
            hideCorpseText();
            hideCorpseExam();
            hideExitPrompt();
            playerInCorpseTriggerZone = false;
        }
    }

    // Check for code trigger collision
    if (playerBox.intersectsBox(codeTrigger)) {
        if (!playerInCodeTriggerZone) {
            console.log("Entered the code trigger zone");
            showCodeText();
            useCode();
            playerInCodeTriggerZone = true;
        }
    }
    else {
        if (playerInCodeTriggerZone) {
            console.log("Exited the code trigger zone");
            hideCodeText();
            clearCode();
            hideExitPrompt();
            playerInCodeTriggerZone = false;
        }
    }

    // Check for file trigger collision
    if (playerBox.intersectsBox(fileTrigger)) {
        if (!playerInFileTriggerZone) {
            console.log("Entered the file trigger zone");
            showFileText();
            playerInFileTriggerZone = true;
        }
    }
    else {
        if (playerInFileTriggerZone) {
            console.log("Exited the file trigger zone");
            hideFileText();
            hideFile();
            hideExitPrompt();
            playerInFileTriggerZone = false;
        }
    }

    // Check for report trigger collision
    if (playerBox.intersectsBox(reportTrigger)) {
        if (!playerInReportTriggerZone) {
            console.log("Entered the report trigger zone");
            showReportText();
            playerInReportTriggerZone = true;
        }
    }
    else {
        if (playerInReportTriggerZone) {
            console.log("Exited the report trigger zone");
            hideReportText();
            hideReport();
            hideExitPrompt();
            playerInReportTriggerZone = false;
        }
    }

    // Check for Charles note trigger collision
    if (playerBox.intersectsBox(charlesNoteTrigger)) {
        if (!playerInCharlesNoteTriggerZone) {
            console.log("Entered the Charles note trigger zone");
            showCharlesNoteText();
            playerInCharlesNoteTriggerZone = true;
        }
    }
    else {
        if (playerInCharlesNoteTriggerZone) {
            console.log("Exited the Charles note trigger zone");
            hideCharlesNoteText();
            hideCharlesNote();
            hideExitPrompt();
            playerInCharlesNoteTriggerZone = false;
        }
    }
}

// ------------------- Neon Light -------------------

const neonLight = new THREE.PointLight(0xffffff, 20)
neonLight.position.set(-8, 2.4, -60)

function loadNeonLight(scene) {
    // Add sound effect
    addSoundToLamp(neonLight);
    
    scene.add(neonLight)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function flickerNeonLight() {
    if (neonLight.visible) {
        if (getRandomInt(320) == 1) {
            neonLight.visible = false;
        }
    }

    if (!neonLight.visible) {
        if (getRandomInt(40) == 1) {
            neonLight.visible = true;
        }
    }
}

export { interact, exteriorTriggers, removeCodeTrigger, loadNeonLight, flickerNeonLight, getKey };