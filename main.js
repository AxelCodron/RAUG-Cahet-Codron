import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';

// Local imports
import { flickerNeonLight, loadNeonLight } from './exterior.js';
// import { myFunction } from './interior.js';

// -------------------------------- Base setup --------------------------------

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

const GRAVITY = 80; // default: 30

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
const playerLight = new THREE.PointLight(0xffffff, 0.5);
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;

const keyStates = {};

// Current room state
let currentRoom = 'hospital-exterior';

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

// -------------------------------- Trigger zones -------------------------------

// Flag to track if player is inside the trigger
let playerInTriggerZone = false;

const corpseTrigger = new THREE.Box3(
  // Min corner (xMin, yMin, zMin)
  new THREE.Vector3(-31, 0, -28),
  // Max corner (xMax, yMax, zMax)
  new THREE.Vector3(-29, 2, -24)
);

// Door trigger
const doorTrigger = new THREE.Box3(
  new THREE.Vector3(-7.55, 0.1, -5.5),
  new THREE.Vector3(-7.45, 3.9, 0.5)
);

// -------------------------------- Event listeners --------------------------------

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

// -------------------------------- Functions --------------------------------

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
  playerLight.position.copy(playerCollider.end);

  // Check for door trigger collision
  if (doorTrigger.containsPoint(camera.position) && currentRoom === 'hospital-exterior') {
    loadNewRoom("reception");
  }
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
  if (keyStates['KeyE']) {
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
  }
  
  else {
    if (playerInTriggerZone) {
      console.log("Exited the trigger zone");
      hideInteractText();
      hideHUD();
      playerInTriggerZone = false;
    }
  }
}

function loadRoom(roomFile) {
  loader.load(roomFile, (gltf) => {
    // Clear the current scene
    scene.clear();

    scene.add(gltf.scene);

    scene.add(playerLight);

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

    // Reset player position
    if (roomFile == 'hospital-exterior.glb') {
      playerCollider.start.set(0, 0.35, 0);
      playerCollider.end.set(0, 1, 0);
      camera.position.copy(playerCollider.end);
      camera.rotation.set(0, 0, 0);

      // Call the functions from exterior.js
      loadNeonLight(scene);
    }
    else if (roomFile == 'reception.glb') {
      playerCollider.start.set(0, 0.85, -4.5);
      playerCollider.end.set(0, 1.5, -4.5);
      camera.position.copy(playerCollider.end);
      camera.rotation.set(0, 0, 0);
      playerLight.position.copy(playerCollider.end);

      // Call the functions from interior.js
      // myFunction();
    }
  });
}

function loadNewRoom(roomName) {
  currentRoom = roomName;
  loadRoom(roomName + '.glb');
}

function teleportPlayerIfOob() {
  if (camera.position.y <= - 25) {
    playerCollider.start.set(0, 0.35, 0);
    playerCollider.end.set(0, 1, 0);
    playerCollider.radius = 0.35;
    camera.position.copy(playerCollider.end);
    camera.rotation.set(0, 0, 0);
    playerLight.position.copy(playerCollider.end);
  }
}

// -------------------------------- Load the initial room --------------------------------

const loader = new GLTFLoader().setPath('/assets/models/');

// Initial room load
loadRoom('hospital-exterior.glb');

// -------------------------------- Main loop --------------------------------

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
}
