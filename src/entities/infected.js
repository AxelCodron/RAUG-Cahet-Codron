// File for the infected model

import * as THREE from 'three';

let model, mixer;

let idleAction, walkAction, runAction;
let actions;

function loadInfected(infectedFile, loader, scene, state = "idle") {
    loader.load(infectedFile, (gltf) => {
        model = gltf.scene;
        scene.add(model);

        model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        const animations = gltf.animations;

        mixer = new THREE.AnimationMixer(model);

        idleAction = mixer.clipAction(animations[0]);
        walkAction = mixer.clipAction(animations[3]);
        runAction = mixer.clipAction(animations[1]);

        actions = [idleAction, walkAction, runAction];

        if (state === 'idle') {
            idleAction.play();
        }
        else if (state === 'walk') {
            walkAction.play();
        }
        else if (state === 'run') {
            runAction.play();
        }
    });
}

function fromWalkToIdle() {
    prepareCrossFade(walkAction, idleAction, 1.0);
}
function fromIdleToWalk() {
    prepareCrossFade(idleAction, walkAction, 0.5);
}
function fromWalkToRun() {
    prepareCrossFade(walkAction, runAction, 2.5);
}
function fromRunToWalk() {
    prepareCrossFade(runAction, walkAction, 5.0);
}

function prepareCrossFade(startAction, endAction, duration) {
    // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if (startAction === idleAction) {
        executeCrossFade(startAction, endAction, duration);
    }
    else {
        synchronizeCrossFade(startAction, endAction, duration);
    }
}

function synchronizeCrossFade(startAction, endAction, duration) {
    mixer.addEventListener('loop', onLoopFinished);
    function onLoopFinished(event) {
        if (event.action === startAction) {
            mixer.removeEventListener('loop', onLoopFinished);
            executeCrossFade(startAction, endAction, duration);
        }
    }
}

function executeCrossFade(startAction, endAction, duration) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    setWeight(endAction, 1);
    endAction.time = 0;

    // Crossfade with warping - you can also try without warping by setting the third parameter to false
    startAction.crossFadeTo(endAction, duration, true);
}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveWeight(weight);
    if (!action.isRunning()) {
        action.play();
    }
}

function infectedLoop(deltaTime) {
    if (mixer) {
        mixer.update(deltaTime);
    }
    if (walkAction && walkAction.isRunning()) {
        model.position.z -= 0.01;
    }
    if (runAction && runAction.isRunning()) {
        model.position.z -= 0.015;
    }
}

export { loadInfected, fromWalkToIdle, fromIdleToWalk, fromWalkToRun, fromRunToWalk, infectedLoop };