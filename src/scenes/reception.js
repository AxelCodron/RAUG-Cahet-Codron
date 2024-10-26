// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------

const hudText = document.getElementById('hud-text');
const drawer1Text = document.getElementById('drawer1-text');
const drawer2Text = document.getElementById('drawer2-text');
const goodDrawerText = document.getElementById('gooddrawer-text');


function displayText(object)
{
    object.style.visibility = "visible";
}

function hideText(object) {
    object.style.visibility = "hidden";
}

// ------------------- Trigger Function -------------------

let playerInDrawer1TriggerZone = false;
let playerInDrawer2TriggerZone = false;
let playerInGoodDrawerTriggerZone = false;


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
// const doorTriggerSize = new THREE.Vector3();
// interiorDoorTrigger.getSize(doorTriggerSize);

// const doorTriggerMesh = new THREE.Mesh(
//     new THREE.BoxGeometry(doorTriggerSize.x, doorTriggerSize.y, doorTriggerSize.z), // Size of the box
//     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }) // Red wireframe material for visualization
// );

//doorTriggerMesh.position.copy(interiorDoorTrigger.getCenter(new THREE.Vector3()));

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
            return false;
        }
    }
    return inTrigger
}

function loadDrawer(infectedFile, loader, scene) {
    loader.load(infectedFile, (gltf) => {
        model = gltf.scene;

        model.scale.set(2.3, 1.778, 1);
        // temporary manual positioning
        model.position.x = 0.2;
        model.position.y = 0.739;
        model.position.z = 0.9;

        scene.add(model);
    });
}

function InteriorTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(interiorDoorTrigger)) {
        loadNewRoom("exterior");
    }
    playerInDrawer1TriggerZone = intersectobject(playerBox, drawer1Trigger, playerInDrawer1TriggerZone, drawer1Text)
    playerInDrawer2TriggerZone = intersectobject(playerBox, drawer2Trigger, playerInDrawer2TriggerZone, drawer2Text)
    playerInGoodDrawerTriggerZone = intersectobject(playerBox, goodDrawerTrigger, playerInGoodDrawerTriggerZone, goodDrawerText)

    // var loader = new GLTFLoader();

    // const loader = new GLTFLoader();
    //     loader.load('drawer.glb', (gltf) => {
    //         drawer = gltf.scene;
    //         scene.add(drawer);

    //         drawer.position.set(0, 0, 0);
    //         if (playerInGoodDrawerTriggerZone and ) 
    //         animateDrawer();
    //     });

}

function loadMesh(scene)
{
}

export { loadDrawer, InteriorTriggers, loadMesh };