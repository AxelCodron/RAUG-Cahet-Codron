// File for the infected model

import * as THREE from 'three';
import { flashRed } from '../utils/shake-camera';

let model, mixer;

let idleAction, walkAction, walkWithArmsAction, runAction, attackAction, fallBackwardAction, fallForwardAction;
let actions;

let isFallingBack = false;
let isDead = false;
const infectedSpeed = 2;

// Animations names:
// NOT USEFUL (animations that move the character on their own):
// walk with arms: Walk
// walk: Walk1
// run: Run

// USEFUL (animations that don't move the character position):
// idle: Idle
// walk in place: Walk1_InPlace
// walk in place with arms: Walk2_InPlace
// run in place: Run_InPlace
// attack: Attack
// falling back: FallingBack
// falling forward: FallingForward


function loadInfected(infectedFile, loader, scene, state = "Run_InPlace") {
    loader.load(infectedFile, (gltf) => {
        model = gltf.scene;

        // temporary manual positioning
        model.position.x = -19;
        model.position.z = 1.5;


        scene.add(model);

        model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        const animations = gltf.animations;

        mixer = new THREE.AnimationMixer(model);

        idleAction = mixer.clipAction(animations[0]);
        walkAction = mixer.clipAction(animations[1]);
        walkWithArmsAction = mixer.clipAction(animations[2]);
        runAction = mixer.clipAction(animations[3]);
        attackAction = mixer.clipAction(animations[4]);
        fallBackwardAction = mixer.clipAction(animations[5]);
        fallForwardAction = mixer.clipAction(animations[6]);

        actions = [idleAction, walkAction, walkWithArmsAction, runAction, attackAction, fallBackwardAction, fallForwardAction];

        if (state === 'Idle') {
            idleAction.play();
        }
        else if (state === 'Walk1_InPlace') {
            walkAction.play();
        }
        else if (state === 'Walk2_InPlace') {
            walkWithArmsAction.play();
        }
        else if (state === 'Run_InPlace') {
            runAction.play();
        }
        else if (state === 'Attack') {
            attackAction.play();
        }
    });
}

function fromIdleToWalk() {
    prepareCrossFade(idleAction, walkAction, 0.5);
}
function fromWalkToRun() {
    prepareCrossFade(walkAction, runAction, 2.5);
}
function fromWalkToWalkWithArms() {
    prepareCrossFade(idleAction, walkWithArmsAction, 0.5);
}
function fromIdleToWalkWithArms() {
    prepareCrossFade(idleAction, walkWithArmsAction, 0.5);
}
function fromWalkWithArmsToRun() {
    prepareCrossFade(walkWithArmsAction, runAction, 2.5);
}
function fromRunToWalk() {
    prepareCrossFade(runAction, walkAction, 5.0);
}
function fromRunToWalkWithArms() {
    prepareCrossFade(runAction, walkWithArmsAction, 5.0);
}
function fromWalkToIdle() {
    prepareCrossFade(walkAction, idleAction, 1.0);
}
function fromWalkWithArmsToIdle() {
    prepareCrossFade(walkWithArmsAction, idleAction, 1.0);
}
function fromRunTofallBack() {
    runAction.stop();
    fallBackwardAction.loop = THREE.LoopOnce;
    fallBackwardAction.clampWhenFinished = true;
    fallBackwardAction.play();
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

function infectedLoop(deltaTime, playerCollider) {
    if (!model) {
        return;
    }
    if (isDead) {
        return;
    }
    // Check for collision with player
    if (playerCollider.start.distanceTo(model.position) < 2 && !isFallingBack) {
        fromRunTofallBack();
        flashRed();
        isFallingBack = true;
        return;
    }

    if (isFallingBack) {
        if (mixer) {
            mixer.update(deltaTime);
            if (!fallBackwardAction.isRunning()) {
                isFallingBack = false;
                isDead = true;
                console.log("Infected is dead");
            }
        }
        return;
    }
    if (mixer) {
        mixer.update(deltaTime);
    }
    const playerPosition = playerCollider.end;
    const direction = new THREE.Vector3();

    // only X and Z vectors are needed
    direction.subVectors(new THREE.Vector3(playerPosition.x, model.position.y, playerPosition.z), model.position).normalize();

    model.position.add(direction.multiplyScalar(infectedSpeed * deltaTime));

    const lookAt = new THREE.Vector3(playerPosition.x, model.position.y, playerPosition.z);
    model.lookAt(lookAt);
}

function removeInfected() {
    if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(model);
        mixer = null;
    }

    if (model) {
        model.traverse((object) => {
            if (object.isMesh) {
                object.geometry.dispose();
                if (object.material.isMaterial) {
                    object.material.dispose();
                } else if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                }
            }
        });
        
        if (model.parent) {
            model.parent.remove(model);
        }
        
        model = null;
    }

    // Reset states
    isDead = false;
    isFallingBack = false;
}


export {
    loadInfected, fromIdleToWalk, fromWalkToRun,
    fromWalkToWalkWithArms, fromIdleToWalkWithArms, fromWalkWithArmsToRun,
    fromRunToWalk, fromRunToWalkWithArms, fromWalkToIdle,
    fromWalkWithArmsToIdle, infectedLoop, removeInfected
};