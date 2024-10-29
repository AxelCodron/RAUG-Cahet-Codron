// File for the exterior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';
import { clearCode, useCode } from '../utils/digits-code';

// ------------------- Variables -------------------

// Flags to track if player is inside the trigger
let playerInCorpseTriggerZone = false;
let playerInCodeTriggerZone = false;

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
    new THREE.Vector3(-36, 0, -32.3),
    new THREE.Vector3(-34, 3, -29)
);

// -------------------------------- GUI --------------------------------

const hudText = document.getElementById('hud-text');
const codeText = document.getElementById('code-text');
const interactText = document.getElementById('interact-text');

function showHUD() {
    if (playerInCorpseTriggerZone) {
        hudText.style.visibility = "visible";
    }
}

function hideHUD() {
    hudText.style.visibility = "hidden";
}

function showInteractText() {
    interactText.style.visibility = "visible";
}

function hideInteractText() {
    interactText.style.visibility = "hidden";
}

function showCodeText() {
    codeText.style.visibility = "visible";
}

function hideCodeText() {
    codeText.style.visibility = "hidden";
}

// ------------------- Trigger Function -------------------

function exteriorTriggers(playerBox) {
    // Check for corpse trigger collision
    if (playerBox.intersectsBox(corpseTrigger)) {
        if (!playerInCorpseTriggerZone) {
            console.log("Entered the trigger zone");
            showInteractText();
            playerInCorpseTriggerZone = true;
        }
    }
    else {
        if (playerInCorpseTriggerZone) {
            console.log("Exited the trigger zone");
            hideInteractText();
            hideHUD();
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

    // Check for door trigger collision
    if (playerBox.intersectsBox(doorTrigger)) {
        loadNewRoom("reception");
    }
}

function removeCodeTrigger() {
    codeTrigger.makeEmpty();
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

export { loadNeonLight, flickerNeonLight, exteriorTriggers, showHUD, removeCodeTrigger };