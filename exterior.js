import * as THREE from 'three';

// Functions for the exterior scenes of the game.

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
        if (getRandomInt(1600) == 1) {
            neonLight.visible = false;
        }
    }

    if (!neonLight.visible) {
        if (getRandomInt(200) == 1) {
            neonLight.visible = true;
        }
    }
}

export { loadNeonLight, flickerNeonLight }