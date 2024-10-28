// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------
const openDoor = document.getElementById('openDoor-text');
const closedDoor = document.getElementById('closedDoor-text');

let playerInBadDoorTriggerZone = false;
let playerInGoodDoorTriggerZone = false;

function showCorridorMessage() {
    if (playerInBadDoorTriggerZone) {
        hideText(openDoor)
        displayText(closedDoor);
    }
    if (playerInGoodDoorTriggerZone) {
        hideText(openDoor);
    }
}
function hideMessage() {
    if (playerInBadDoorTriggerZone | playerInGoodDoorTriggerZone) {
        hideText(openDoor);
        hideText(closedDoor);
    }
}

function displayText(object) {
    object.style.visibility = "visible";
}
  
function hideText(object) {
    object.style.visibility = "hidden";
}

// ------------------- Trigger Function -------------------

const Door1Trigger = new THREE.Box3(
    new THREE.Vector3(1.3, -0.05, -14.65),
    new THREE.Vector3(1.7, 2.05, -13.85)
)
const Door2Trigger = new THREE.Box3(
    new THREE.Vector3(3.45, -0.05, -14.65),
    new THREE.Vector3(3.85, 2.05, -13.85)
)
const Door3Trigger = new THREE.Box3(
    new THREE.Vector3(3.45, -0.05, -9.8),
    new THREE.Vector3(3.85, 2.05, -9.0)
)
const Door4Trigger = new THREE.Box3(
    new THREE.Vector3(1.3, -0.05, -8.7),
    new THREE.Vector3(1.7, 2.05, -7.9)
)
const Door5Trigger = new THREE.Box3(
    new THREE.Vector3(3.45, -0.05, -5.1),
    new THREE.Vector3(3.85, 2.05, -4.3)
)
const Door6Trigger = new THREE.Box3(
    new THREE.Vector3(3.45, -0.05, 1.094),
    new THREE.Vector3(3.85, 2.05, 1.894)
)
const Door7Trigger = new THREE.Box3(
    new THREE.Vector3(3.45, -0.05, 7.5),
    new THREE.Vector3(3.85, 2.05, 8.3)
)
const Door8Trigger = new THREE.Box3(
    new THREE.Vector3(1.3, -0.05, 2.6),
    new THREE.Vector3(1.7, 2.05, 3.4)
)
const goodDoorTrigger = new THREE.Box3(
    new THREE.Vector3(1.3, -0.05, 7.5),
    new THREE.Vector3(1.7, 2.05, 8.3)
)
const receptionDoorTrigger = new THREE.Box3(
    new THREE.Vector3(1.8, 0, -16.5),
    new THREE.Vector3(3.3, 2.2, -16.1)
)

function intersectobject(playerBox, Trigger, inTrigger, text)
{
    if (playerBox.intersectsBox(Trigger)) {
        if (!inTrigger) {
            console.log("Entered the trigger zone");
            displayText(text);
            return true;
        }
    }
    else {
        if (inTrigger) {
            console.log("Exited the trigger zone");
            hideText(text);
            hideMessage(text);
            return false;
        }
    }
    return inTrigger
}

function corridorTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(receptionDoorTrigger)) {
        loadNewRoom("reception");
    }
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door1Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door2Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door3Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door4Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door5Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door6Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door7Trigger, playerInBadDoorTriggerZone, openDoor)
    playerInBadDoorTriggerZone = intersectobject(playerBox, Door8Trigger, playerInBadDoorTriggerZone, openDoor)
    
    playerInGoodDoorTriggerZone = intersectobject(playerBox, goodDoorTrigger, playerInGoodDoorTriggerZone, openDoor)

}


export { corridorTriggers, showCorridorMessage };