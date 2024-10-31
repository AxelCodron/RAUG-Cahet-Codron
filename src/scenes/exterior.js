// File for the exterior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';
import { clearCode, useCode } from '../utils/digits-code';

// ------------------- Variables -------------------

// Flags to track if player is inside the trigger
let playerInCorpseTriggerZone = false;
let playerInCodeTriggerZone = false;
let playerInFileTriggerZone = false;
let playerInReportTriggerZone = false;
let playerInCharlesNoteTriggerZone = false;

const corpseTrigger = new THREE.Box3(
    // Min corner (xMin, yMin, zMin)
    new THREE.Vector3(-31, 0, -28),
    // Max corner (xMax, yMax, zMax)
    new THREE.Vector3(-29, 2, -24)
);

// Door trigger
const doorTrigger = new THREE.Box3(
    new THREE.Vector3(-7.55, 0.1, -5.5),
    new THREE.Vector3(-7.45, 3.9, 0.5)
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
const corpseText = document.getElementById('corpse-text');
const fileText = document.getElementById('file-text');
const reportText = document.getElementById('report-text');
const charlesNoteText = document.getElementById('charles-note-text');
const codeText = document.getElementById('code-text');

// Corpse Exam
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
    if (playerInCorpseTriggerZone) {
        showCorpseExam();
    }
    if (playerInFileTriggerZone) {
        if (corpseTimeline.style.visibility === "hidden") {
            showFile();
            hideFileText();
        }
        else {
            hideFile();
            showFileText();
        }
    }
    if (playerInReportTriggerZone) {
        if (report.style.visibility === "hidden") {
            showReport();
            hideReportText();
        }
        else {
            hideReport();
            showReportText();
        }
    }
    if (playerInCharlesNoteTriggerZone) {
        if (charlesNote.style.visibility === "hidden") {
            showCharlesNote();
            hideCharlesNoteText();
        }
        else {
            hideCharlesNote();
            showCharlesNoteText();
        }
    }
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

// ------------------- Trigger Function -------------------

function exteriorTriggers(playerBox) {
    // Check for corpse trigger collision
    if (playerBox.intersectsBox(corpseTrigger)) {
        if (!playerInCorpseTriggerZone) {
            console.log("Entered the trigger zone");
            showCorpseText();
            playerInCorpseTriggerZone = true;
        }
    }
    else {
        if (playerInCorpseTriggerZone) {
            console.log("Exited the trigger zone");
            hideCorpseText();
            hideCorpseExam();
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
            playerInCharlesNoteTriggerZone = false;
        }
    }

    // Check for door trigger collision
    if (playerBox.intersectsBox(doorTrigger)) {
        loadNewRoom("reception");
    }
}

// ------------------- Neon Light -------------------

const neonLight = new THREE.PointLight(0xffffff, 20)
neonLight.position.set(-8, 2.4, -60)

function loadNeonLight(scene) {
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

export { interact, exteriorTriggers, removeCodeTrigger, loadNeonLight, flickerNeonLight };