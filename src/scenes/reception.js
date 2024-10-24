// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// ------------------- Trigger Function -------------------

const interiorDoorTrigger = new THREE.Box3(
    new THREE.Vector3(3.3, 0, 4.),
    new THREE.Vector3(6.1, 2.8, 4.6)
)
const doorTriggerSize = new THREE.Vector3();
interiorDoorTrigger.getSize(doorTriggerSize);

const doorTriggerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(doorTriggerSize.x, doorTriggerSize.y, doorTriggerSize.z), // Size of the box
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }) // Red wireframe material for visualization
);

doorTriggerMesh.position.copy(interiorDoorTrigger.getCenter(new THREE.Vector3()));

function InteriorTriggers(playerBox) {
    // Check for door trigger collision
    if (playerBox.intersectsBox(interiorDoorTrigger)) {
        loadNewRoom("exterior");
        console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    }
    console.log("HOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

}

function loadMesh(scene)
{
    scene.add(doorTriggerMesh)
}

export { InteriorTriggers, loadMesh };