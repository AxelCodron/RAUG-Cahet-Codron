// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------
const openDoor = document.getElementById('openDoor-text');
const closedDoor = document.getElementById('closedDoor-text');
const zombieDoor = document.getElementById('zombieDoor-text');

let playerInBadDoorTriggerZone = false;
let playerInZombieDoorTriggerZone = false;
let playerInGoodDoorTriggerZone = false;

function showCorridorMessage() {
    if (playerInBadDoorTriggerZone) {
        hideText(openDoor)
        displayText(closedDoor);
    }
    if (playerInGoodDoorTriggerZone) {
        hideText(openDoor);
        loadNewRoom('room');
    }
    if (playerInZombieDoorTriggerZone) {
        hideText(openDoor);
        displayText(zombieDoor);
    }
}

function hideMessage() {
    hideText(openDoor);
    hideText(closedDoor);
    hideText(zombieDoor);
}

function displayText(object) {
    object.style.visibility = "visible";
}
  
function hideText(object) {
    object.style.visibility = "hidden";
}

// ------------------- Trigger Function -------------------

const Door1Trigger = new THREE.Box3(
    new THREE.Vector3(1.25, -0.05, -14.65),
    new THREE.Vector3(1.75, 2.05, -13.85)
)
const Door2Trigger = new THREE.Box3(
    new THREE.Vector3(3.35, -0.05, -14),
    new THREE.Vector3(3.85, 2.05, -13.2)
)
const Door3Trigger = new THREE.Box3(
    new THREE.Vector3(3.35, -0.05, -9.8),
    new THREE.Vector3(3.85, 2.05, -9.0)
)
const Door4Trigger = new THREE.Box3(
    new THREE.Vector3(1.25, -0.05, -8.7),
    new THREE.Vector3(1.75, 2.05, -7.9)
)
const Door5Trigger = new THREE.Box3(
    new THREE.Vector3(3.35, -0.05, -5.1),
    new THREE.Vector3(3.85, 2.05, -4.3)
)
const Door6Trigger = new THREE.Box3(
    new THREE.Vector3(3.35, -0.05, 1.094),
    new THREE.Vector3(3.85, 2.05, 1.894)
)
const Door7Trigger = new THREE.Box3(
    new THREE.Vector3(3.35, -0.05, 7.5),
    new THREE.Vector3(3.85, 2.05, 8.3)
)
const Door8Trigger = new THREE.Box3(
    new THREE.Vector3(1.25, -0.05, 2.6),
    new THREE.Vector3(1.75, 2.05, 3.4)
)
const goodDoorTrigger = new THREE.Box3(
    new THREE.Vector3(1.25, -0.05, 7.5),
    new THREE.Vector3(1.75, 2.05, 8.3)
)
const receptionDoorTrigger = new THREE.Box3(
    new THREE.Vector3(1.8, 0, -16.5),
    new THREE.Vector3(3.3, 2.2, -16.1)
)

const doorArray = [Door1Trigger, Door2Trigger, Door3Trigger, Door4Trigger, Door5Trigger, Door6Trigger, Door7Trigger]

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
    return inTrigger;
}

function intersectMultipleObject(playerBox, Triggers, inTrigger, text)
{
    let intersect = false;
    for (const Trigger of Triggers) {
        if (playerBox.intersectsBox(Trigger)) {
            if (!inTrigger) {
                console.log("Entered the trigger zone");
                displayText(text);
            }
            return true;
        }
    }
    if (inTrigger & !intersect) {
        console.log("Exited the trigger zone");
        hideText(text);
        hideMessage(text);
    }
    return false;
}

function corridorTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(receptionDoorTrigger)) {
        loadNewRoom("reception");
    }
    playerInBadDoorTriggerZone = intersectMultipleObject(playerBox, doorArray, playerInBadDoorTriggerZone, openDoor)
    playerInZombieDoorTriggerZone = intersectobject(playerBox, Door8Trigger, playerInZombieDoorTriggerZone, openDoor)
    playerInGoodDoorTriggerZone = intersectobject(playerBox, goodDoorTrigger, playerInGoodDoorTriggerZone, openDoor)

}


export { corridorTriggers, showCorridorMessage };