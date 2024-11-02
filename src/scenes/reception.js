// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------

const drawer1Text = document.getElementById('drawer1-text');
const drawer2Text = document.getElementById('drawer2-text');

const goodDrawerText = document.getElementById('gooddrawer-text');
const itemsContainer = document.getElementById('items-container');
const blurred = document.getElementById('blur');


const badText = document.getElementById('bad-text');
const goodText = document.getElementById('good-text');
const searchedText = document.getElementById('searched-text');

const useCardText = document.getElementById('useCard-text');
const noCardText = document.getElementById('noCard-text');
const dontOpenText = document.getElementById('dontOpen-text');
const openText = document.getElementById('Open-text');

let playerInDrawer1TriggerZone = false;
let playerInDrawer2TriggerZone = false;
let playerInGoodDrawerTriggerZone = false;
let playerInRightDoorTriggerZone = false;
let playerInLeftDoorTriggerZone = false;
let animateDrawer = false;
let itemsOn = false;
let leftDoorOpen = false;
let model;

function showMessage() {
    if (playerInDrawer1TriggerZone) {
        hideText(drawer1Text)
        displayText(badText);
    }
    if (playerInDrawer2TriggerZone) {
        hideText(drawer2Text)
        displayText(badText);
    }
    if (playerInGoodDrawerTriggerZone & !itemsOn) {
        hideText(goodDrawerText);
        animateDrawer = true;
    }
    else if (playerInGoodDrawerTriggerZone & itemsOn & goodText.style.visibility == "hidden") {
        hideText(goodDrawerText);
        displayText(searchedText);
    }
    else if (playerInGoodDrawerTriggerZone & itemsOn & itemsContainer.style.display == 'flex') {
        hideText(searchedText);
        hideMessage();
    }
    if (playerInRightDoorTriggerZone & itemsOn) {
        hideText(useCardText);
        displayText(dontOpenText);
    }
    if (playerInLeftDoorTriggerZone & itemsOn) {
        hideText(useCardText);
        leftDoorOpen = true;
    }
}
function hideMessage() {
    if (playerInDrawer1TriggerZone | playerInDrawer2TriggerZone) {
        hideText(badText);
    }
    if (playerInGoodDrawerTriggerZone) {
        hideText(searchedText);
        hideText(goodText);
        hideText(goodDrawerText);
        itemsContainer.style.display = 'none';
        blurred.style.display = 'none';

    }
    if (playerInRightDoorTriggerZone) {
        hideText(dontOpenText);
    }
    if (playerInLeftDoorTriggerZone) {
        hideText(openText);
    }
}

function displayText(object) {
    object.style.visibility = "visible";
}

function hideText(object) {
    object.style.visibility = "hidden";
}

// ------------------- Trigger Function -------------------

const interiorDoorTrigger = new THREE.Box3(
    new THREE.Vector3(3.3, 0, 4.),
    new THREE.Vector3(6.1, 2.8, 4.6)
)

const drawer1Trigger = new THREE.Box3(
    new THREE.Vector3(1.5, 0, -2.5),
    new THREE.Vector3(2.5, 2, -1.5)
)

const drawer2Trigger = new THREE.Box3(
    new THREE.Vector3(-1.7, 0, -1.75),
    new THREE.Vector3(-0.7, 2, -0.75)
)

const goodDrawerTrigger = new THREE.Box3(
    new THREE.Vector3(-0.25, 0, -1.5),
    new THREE.Vector3(0.75, 2, -0.5)
)

const rightDoorTrigger = new THREE.Box3(
    new THREE.Vector3(4.35, 0, -4.6),
    new THREE.Vector3(5.85, 2, -4.2)
)

const leftDoorTrigger = new THREE.Box3(
    new THREE.Vector3(-5.5, 0, -4.6),
    new THREE.Vector3(-4, 2, -4.2)
)

// const doorTriggerSize = new THREE.Vector3();
// interiorDoorTrigger.getSize(doorTriggerSize);

// const doorTriggerMesh = new THREE.Mesh(
//     new THREE.BoxGeometry(doorTriggerSize.x, doorTriggerSize.y, doorTriggerSize.z), // Size of the box
//     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }) // Red wireframe material for visualization
// );

//doorTriggerMesh.position.copy(interiorDoorTrigger.getCenter(new THREE.Vector3()));

function intersectobject(playerBox, Trigger, inTrigger, text) {
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
            hideMessage();
            if (playerInGoodDrawerTriggerZone & itemsOn & itemsContainer.style.display == 'flex') {
                return true;
            }
            return false;
        }
    }
    return inTrigger
}

function loadDrawer(drawer, loader, scene) {
    loader.load(drawer, (gltf) => {
        model = gltf.scene;

        model.scale.set(2.3, 1.778, 1);
        model.position.set(0.2, 0.739, -0.571);
        model.rotation.y += Math.PI;

        scene.add(model);
    });
}

function receptionTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(interiorDoorTrigger)) {
        loadNewRoom("exterior");
    }
    if (playerBox.intersectsBox(leftDoorTrigger) & leftDoorOpen == true) {
        leftDoorOpen = false;
        loadNewRoom("corridor");
    }
    playerInDrawer1TriggerZone = intersectobject(playerBox, drawer1Trigger, playerInDrawer1TriggerZone, drawer1Text)
    playerInDrawer2TriggerZone = intersectobject(playerBox, drawer2Trigger, playerInDrawer2TriggerZone, drawer2Text)
    playerInGoodDrawerTriggerZone = intersectobject(playerBox, goodDrawerTrigger, playerInGoodDrawerTriggerZone, goodDrawerText)
    if (itemsOn) {
        playerInRightDoorTriggerZone = intersectobject(playerBox, rightDoorTrigger, playerInRightDoorTriggerZone, useCardText)
        playerInLeftDoorTriggerZone = intersectobject(playerBox, leftDoorTrigger, playerInLeftDoorTriggerZone, useCardText)
    }
    else {
        playerInRightDoorTriggerZone = intersectobject(playerBox, rightDoorTrigger, playerInRightDoorTriggerZone, noCardText)
        playerInLeftDoorTriggerZone = intersectobject(playerBox, leftDoorTrigger, playerInLeftDoorTriggerZone, noCardText)
    }

    if (animateDrawer) {
        if (model.position.z > -0.9) {
            model.position.z -= 0.01;
        }
        else {
            displayText(goodText)
            itemsContainer.style.display = 'flex';
            blurred.style.display = 'block';
            itemsOn = true;
            animateDrawer = false
        }
    }

}

export { loadDrawer, receptionTriggers, showMessage };