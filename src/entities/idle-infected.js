// File for the infected model

import * as THREE from 'three';

let model, mixer;

let idleAction;

// Animations names:
// static zombie: Armature|mixamo.com|Layer0

function loadIdleInfected(infectedFile, loader, scene) {
    loader.load(infectedFile, (gltf) => {
        model = gltf.scene;

        model.scale.set(0.6, 0.6, 0.6);
        // temporary manual positioning
        model.position.z = -8;
        
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