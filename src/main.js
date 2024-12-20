import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';

// Local imports
import { loadInfected, infectedLoop, removeInfected } from './entities/moving-infected.js';
import { flickerNeonLight, loadNeonLight, exteriorTriggers, interact } from './scenes/exterior.js';
import { idleInfectedLoop, loadIdleInfected } from './entities/idle-infected.js';
import { hideIntroduction, showIntroduction, waitForAnyKey } from './scenes/intro.js';
import { loadDrawer, receptionTriggers, showMessage } from './scenes/reception.js';
import { corridorTriggers, showCorridorMessage } from './scenes/corridor.js';
import { addListenerToCamera, pauseFootsteps, playExteriorBackgroundMusic, playFootsteps, playMeetingBrotherMusic, stopBackgroundMusic } from './utils/sounds.js';
import { roomTriggers, brotherDialogue, exitDialogue, finalDialogue } from './scenes/room.js';

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

const STEPS_PER_FRAME = 1;

const worldOctree = new Octree();

const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
const playerLight = new THREE.PointLight(0xffffff, 0.5);
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;

const keyStates = {};

const loader = new GLTFLoader().setPath('/RAUG-Cahet-Codron/assets/models/');

// Loading state
let isLoading = false;

// Current room state
let currentRoom = 'exterior';
let precedentRoom = 'exterior';

// Cuurent game state
let gameStarted = false;
const keyPressed = {};

// ------------------------------------ GUI ------------------------------------

const loaderElement = document.getElementById('loader');
const blackScreenElement = document.getElementById('blackscreen');
const loadingBar = document.querySelector('.loading-bar');

// -------------------------------- Event listeners --------------------------------

document.addEventListener('keydown', (event) => {
  if (!keyPressed[event.code]) {
    keyStates[event.code] = true;
    keyPressed[event.code] = true;
  }
});

document.addEventListener('keyup', (event) => {
  keyStates[event.code] = false;
  keyPressed[event.code] = false;
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

// Handle single clicks for interactions specifically
document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyE') {
    interact();
    if (currentRoom === 'reception') {
      showMessage();
    }
    if (currentRoom === 'corridor') {
      showCorridorMessage();
    }
    if (currentRoom === 'room') {
      exitDialogue();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyY') {
    if (currentRoom === 'room') {
      finalDialogue(true);
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyN') {
    if (currentRoom === 'room') {
      finalDialogue(false);
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    if (currentRoom === 'room') {
      brotherDialogue();
    }
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

  let playerPositions = playerCollider.end.clone();
  playerPositions.y += 0.8;

  camera.position.copy(playerPositions);
  playerLight.position.copy(playerCollider.end);
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

  if ((keyStates['KeyW'] || keyStates['KeyS'] || keyStates['KeyA'] || keyStates['KeyD']) && !isLoading) {
    playFootsteps();
  }
  else {
    pauseFootsteps();
  }

  if (keyStates['KeyW'] && !isLoading) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }

  if (keyStates['KeyS'] && !isLoading) {
    playerVelocity.add(getForwardVector().multiplyScalar(- speedDelta));
  }

  if (keyStates['KeyA'] && !isLoading) {
    playerVelocity.add(getSideVector().multiplyScalar(- speedDelta));
  }

  if (keyStates['KeyD'] && !isLoading) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }
}

function checkTriggers() {
  const playerBox = new THREE.Box3().setFromPoints([
    playerCollider.start,
    playerCollider.end
  ]);

  if (currentRoom === 'exterior') {
    exteriorTriggers(playerBox);
  }
  if (currentRoom === 'reception') {
    receptionTriggers(playerBox);
  }
  if (currentRoom === 'corridor') {
    corridorTriggers(playerBox);
  }
  if (currentRoom === 'room') {
    roomTriggers(playerBox);
  }
}

function loadRoom(roomFile) {
  return new Promise((resolve, reject) => {
    console.log('Loading room:', roomFile);
    blackScreenElement.style.visibility = 'visible';
    loaderElement.style.visibility = 'visible';
    isLoading = true;

    // Disable player physics/controls while loading
    playerOnFloor = true;  // Prevent initial falling
    playerVelocity.y = 0;  // Reset vertical velocity

    loader.load(
      roomFile,
      (gltf) => {
        try {
          // Clear the current scene
          removeInfected();
          scene.clear();
          worldOctree.clear();

          // Add scene elements
          scene.add(gltf.scene);
          scene.add(playerLight);

          // Process meshes first
          gltf.scene.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material.map) {
                child.material.map.anisotropy = 4;
              }
            }
          });

          // Process octree with a small delay to ensure scene is ready
          setTimeout(() => {
            console.log('Computing octree...');
            worldOctree.fromGraphNode(gltf.scene);

            // Setup room-specific elements after octree is ready
            setupRoomSpecifics(roomFile);

            // Give a small additional delay for the octree to finish internal computations
            setTimeout(() => {
              console.log('Room fully loaded and collision ready');
              loaderElement.style.visibility = 'hidden';
              blackScreenElement.style.visibility = 'hidden';
              isLoading = false;
              loadingBar.style.width = '0%';

              // Ensure player is properly positioned before enabling physics
              playerCollider.start.copy(camera.position).y -= 0.35;
              playerCollider.end.copy(camera.position).y += 0.35;
              playerOnFloor = false;  // Reset this to allow proper physics

              resolve();
            }, 100);  // Small delay for octree completion
          }, 50);  // Small delay before starting octree computation

        } catch (error) {
          console.error('Error processing room:', error);
          reject(error);
        }
      },
      (progress) => {
        const percentComplete = Math.round((progress.loaded / progress.total) * 100);
        loadingBar.style.width = percentComplete + '%';
        console.log(percentComplete + '%');
      },
      (error) => {
        console.error('An error occurred while loading the model:', error);
        loaderElement.style.visibility = 'hidden';
        blackScreenElement.style.visibility = 'hidden';
        reject(error);
      }
    );
  });
}

// Helper function to handle room-specific setup (unchanged)
function setupRoomSpecifics(roomFile) {
  stopBackgroundMusic();

  switch (roomFile) {
    case 'exterior.glb':
      playerCollider.start.set(0, 0.35, 0);
      playerCollider.end.set(0, 1, 0);
      camera.position.copy(playerCollider.end);
      camera.rotation.set(0, 0, 0);
      playExteriorBackgroundMusic();
      loadNeonLight(scene);
      break;

    case 'reception.glb':
      if (precedentRoom === 'exterior') {
        playerCollider.start.set(5, 0.675, 3);
        playerCollider.end.set(5, 1.325, 3);
        camera.rotation.set(0, 0, 0);
      } else {
        playerCollider.start.set(-4.7, 0.675, -3.5);
        playerCollider.end.set(-4.7, 1.325, -3.5);
        camera.rotation.set(0, Math.PI, 0);
      }
      camera.position.copy(playerCollider.end);
      playerLight.position.copy(playerCollider.end);
      loadDrawer('drawer.glb', loader, scene);
      break;

    case 'corridor.glb':
      if (precedentRoom === 'reception') {
        playerCollider.start.set(2.2, 0.675, -15);
        playerCollider.end.set(2.2, 1.325, -15);
        camera.rotation.set(0, Math.PI, 0);
      } else {
        playerCollider.start.set(2, 0.675, 8);
        playerCollider.end.set(2, 1.325, 8);
        camera.rotation.set(0, 0, 0);
      }
      camera.position.copy(playerCollider.end);
      playerLight.position.copy(playerCollider.end);
      loadIdleInfected('idle-infected.glb', loader, scene, new THREE.Vector3(-2, 0, 3.5), new THREE.Vector3(0, 180, 0));
      break;

    case 'room.glb':
      playerCollider.start.set(0, 1.5, -2.6);
      playerCollider.end.set(0, 2.15, -2.6);
      camera.rotation.set(0, Math.PI, 0);
      camera.position.copy(playerCollider.end);
      playerLight.position.copy(playerCollider.end);
      playMeetingBrotherMusic();
      break;
  }
}

function loadNewRoom(roomName) {
  precedentRoom = currentRoom;
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

function spawnInfected() {
  loadInfected('moving-infected.glb', loader, scene);
}

// -------------------------------- Load the initial room --------------------------------

addListenerToCamera(camera);

showIntroduction();

if (!gameStarted) {
  waitForAnyKey(() => {
    gameStarted = true;
    hideIntroduction();

    // Initial room load
    loadRoom(currentRoom + '.glb');
  });
}

// -------------------------------- Main loop --------------------------------

function animate() {
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    infectedLoop(deltaTime, playerCollider);
    idleInfectedLoop(deltaTime);
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
    flickerNeonLight();
    checkTriggers();
  }
  renderer.render(scene, camera);
}

// exports
export { loadNewRoom, spawnInfected }