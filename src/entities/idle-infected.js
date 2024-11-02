// File for the infected model

import * as THREE from 'three';
import { addSoundToInfected, playInfectedSound } from '../utils/sounds';

let model, mixer;

let idleAction;

// Animations names:
// static zombie: Armature|mixamo.com|Layer0

function loadIdleInfected(infectedFile, loader, scene, position = new THREE.Vector3(0, 0, -8), rotation = new THREE.Vector3(0, 0, 0)) {
    loader.load(infectedFile, (gltf) => {
        model = gltf.scene;

        model.scale.set(0.6, 0.6, 0.6);

        // Manual positioning
        model.position.set(position.x, position.y, position.z)
        model.rotation.set(rotation.x, rotation.y, rotation.z)

        // Sound for the infected
        addSoundToInfected(model);
        playInfectedSound();

        scene.add(model);

        model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        const animations = gltf.animations;

        mixer = new THREE.AnimationMixer(model);

        idleAction = mixer.clipAction(animations[0]);
        idleAction.play();
    });
}

function restartAnimation() {
    idleAction.stop();
    idleAction.play();
}

function idleInfectedLoop(deltaTime) {
    if (mixer) {
        mixer.update(deltaTime);
    }
}

export { loadIdleInfected, restartAnimation, idleInfectedLoop };