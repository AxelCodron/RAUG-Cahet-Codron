import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

import { Capsule } from 'three/addons/math/Capsule.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// -------------------------------- Scene --------------------------------

const clock = new THREE.Clock();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';

const container = document.getElementById('container');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// const stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.top = '0px';
// container.appendChild(stats.domElement);

const GRAVITY = 50; // default: 30

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);

const playerLight = new THREE.PointLight(0xffffff, 0.5);
playerLight.position.set(0, 10, 0); // Adjust the light position relative to the player

const neonLight = new THREE.PointLight(0xffffff, 20)
neonLight.position.set(-8, 2.4, -60)

scene.add(neonLight)
scene.add(playerLight)

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

// -------------------------------- GUI --------------------------------

const hudText = document.getElementById('hud-text');

function showHUD() {
  hudText.style.visibility = "visible";
}

function hideHUD() {
  hudText.style.visibility = "hidden";
}

const interactText = document.getElementById('interact-text');

function showInteractText() {
  interactText.style.visibility = "visible";
}

function hideInteractText() {
  interactText.style.visibility = "hidden";
}

// -------------------------------- trigger zones -------------------------------

const corpseTrigger = new THREE.Box3(
  // Min corner (xMin, yMin, zMin)
  new THREE.Vector3(-31, 0, -28),
  // Max corner (xMax, yMax, zMax)
  new THREE.Vector3(-29, 2, -24)
);

// Flag to track if player is inside the trigger
let playerInTriggerZone = false;

// EXAMPLE OF A MESH FOR DEBUGGING

// const corpseTriggerSize = new THREE.Vector3();
// corpseTrigger.getSize(corpseTriggerSize); 

// const corpseTriggerMesh = new THREE.Mesh(
//   new THREE.BoxGeometry(corpseTriggerSize.x, corpseTriggerSize.y, corpseTriggerSize.z), // Size of the box
//   new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }) // Red wireframe material for visualization
// );

// corpseTriggerMesh.position.copy(corpseTrigger.getCenter(new THREE.Vector3()));

// scene.add(corpseTriggerMesh);

// -------------------------------- functions --------------------------------

let playerOnFloor = false;

const keyStates = {};

document.addEventListener('keydown', (event) => {

  keyStates[event.code] = true;

});

document.addEventListener('keyup', (event) => {

  keyStates[event.code] = false;

});

container.addEventListener('mousedown', () => {

  document.body.requestPointerLock();

});

document.body.addEventListener('mousemove', (event) => {

  if (document.pointerLockElement === document.body) {

    camera.rotation.y -= event.movementX / 500;
    camera.rotation.x -= event.movementY / 500;

  }

});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function playerCollisions() {

  const result = worldOctree.capsuleIntersect(playerCollider);

  playerOnFloor = false;

  if (result) {

    playerOnFloor = result.normal.y > 0;

    if (!playerOnFloor) {

      playerVelocity.addScaledVector(result.normal, - result.normal.dot(playerVelocity));

    }

    if (result.depth >= 1e-10) {

      playerCollider.translate(result.normal.multiplyScalar(result.depth));

    }

  }

}

function updatePlayer(deltaTime) {

  let damping = Math.exp(- 4 * deltaTime) - 1;

  if (!playerOnFloor) {

    playerVelocity.y -= GRAVITY * deltaTime;

    // small air resistance
    damping *= 0.1;

  }

  playerVelocity.addScaledVector(playerVelocity, damping);

  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);

  playerCollisions();

  camera.position.copy(playerCollider.end);

  playerLight.position.copy(playerCollider.end)
}

function getForwardVector() {

  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;

}

function getSideVector() {

  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(camera.up);

  return playerDirection;

}

function controls(deltaTime) {

  // gives a bit of air control
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyStates['KeyW']) {

    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));

  }

  if (keyStates['KeyS']) {

    playerVelocity.add(getForwardVector().multiplyScalar(- speedDelta));

  }

  if (keyStates['KeyA']) {

    playerVelocity.add(getSideVector().multiplyScalar(- speedDelta));

  }

  if (keyStates['KeyD']) {

    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));

  }

  if (playerOnFloor) {

    if (keyStates['Space']) {

      playerVelocity.y = 15;

    }

  }

  // Objects interaction
  if(keyStates['KeyE']) {

    if (playerInTriggerZone) {
      showHUD();
    }
    
  }

}

function checkTriggers() {
  const playerBox = new THREE.Box3().setFromPoints([
    playerCollider.start,
    playerCollider.end
  ]);

  if (playerBox.intersectsBox(corpseTrigger)) {
    if (!playerInTriggerZone) {
      console.log("Entered the trigger zone");
      showInteractText();
      
      playerInTriggerZone = true;
    }
  } else {
    if (playerInTriggerZone) {
      console.log("Exited the trigger zone");
      hideInteractText();
      hideHUD();
      
      playerInTriggerZone = false;
    }
  }
}

const loader = new GLTFLoader().setPath('/assets/models/');

loader.load('scene.glb', (gltf) => {

  scene.add(gltf.scene);

  worldOctree.fromGraphNode(gltf.scene);

  gltf.scene.traverse(child => {

    if (child.isMesh) {

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material.map) {

        child.material.map.anisotropy = 4;

      }

    }

  });

  // const helper = new OctreeHelper(worldOctree);
  // helper.visible = false;
  // scene.add(helper);

  // const gui = new GUI({ width: 200 });
  // gui.add({ debug: false }, 'debug')
  //   .onChange(function (value) {

  //     helper.visible = value;

  //   });

});

function teleportPlayerIfOob() {

  if (camera.position.y <= - 25) {

    playerCollider.start.set(0, 0.35, 0);
    playerCollider.end.set(0, 1, 0);
    playerCollider.radius = 0.35;
    camera.position.copy(playerCollider.end);
    camera.rotation.set(0, 0, 0);
    playerLight.position.copy(playerCollider.end)

  }

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


function animate() {

  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for (let i = 0; i < STEPS_PER_FRAME; i++) {

    controls(deltaTime);

    updatePlayer(deltaTime);

    teleportPlayerIfOob();

    flickerNeonLight();

    checkTriggers();
  }

  renderer.render(scene, camera);

  // stats.update();

}
