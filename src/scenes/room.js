// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------
const launchDialogue = document.getElementById('launchDialogue-text');
const dialogueContainer = document.getElementById('dialogue-container');
const dialogueText = document.getElementById('dialogue-text');

let startDialogue = false;
// ------------------- Trigger Function -------------------

const corridorDoorTrigger = new THREE.Box3(
    new THREE.Vector3(-2.9, 0, -4.3),
    new THREE.Vector3(-0.5, 3.5, -3.7)
)

function updateDialogue(text) {
    dialogueText.innerText = text;
}

function toggleDialogue(show) {
    startDialogue = !startDialogue;
    dialogueContainer.style.display = startDialogue ? 'block' : 'none';
  }

function brotherDialogue(){
    toggleDialogue(); // Toggle dialogue visibility
    updateDialogue("Welcome to the world of Three.js!"); // Customize this text as needed

}

function roomTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(corridorDoorTrigger)) {
        loadNewRoom("corridor");
    }

    launchDialogue.style.visibility = "visible"
}


export { roomTriggers, brotherDialogue };