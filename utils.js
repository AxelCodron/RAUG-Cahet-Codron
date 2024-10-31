// File for debugging only, not used in the final game

import Stats from 'three/addons/libs/stats.module.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// EXAMPLE OF A MESH FOR DEBUGGING

const corpseTriggerSize = new THREE.Vector3();
corpseTrigger.getSize(corpseTriggerSize);

const corpseTriggerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(corpseTriggerSize.x, corpseTriggerSize.y, corpseTriggerSize.z), // Size of the box
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }) // Red wireframe material for visualization
);

corpseTriggerMesh.position.copy(corpseTrigger.getCenter(new THREE.Vector3()));

scene.add(corpseTriggerMesh);

// LOADS THE AMOUNT OF FPS THE GAME IS RUNNING AT

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild(stats.domElement);

stats.update();

// DISPLAYS THE OCTREE IN THE SCENE

const helper = new OctreeHelper(worldOctree);
helper.visible = false;
scene.add(helper);

const gui = new GUI({ width: 200 });
gui.add({ debug: false }, 'debug')
    .onChange(function (value) {
        helper.visible = value;
    });