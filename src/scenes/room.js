// File for the interior scene of the game.

import * as THREE from 'three';

import { loadNewRoom } from '../main';

// -------------------------------- GUI --------------------------------
const launchDialogue = document.getElementById('launchDialogue-text');
const dialogueContainer = document.getElementById('dialogue-container');
const dialogueText = document.getElementById('dialogue-text');
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const blurred = document.getElementById('blur');
const exitPrompt = document.getElementById('exit-prompt');
const pauseOverlay = document.getElementById('pause-overlay');
const pauseText = document.getElementById('pause-text');

let playerInBrotherTriggerZone = false;
let startDialogue = false;
let currentDialogueIndex = 0;

const dialogues = [
    { speaker: "Brother", text: "You came all the way here for me? Are you ok?" },
    { speaker: "You", text: "Of course I did. I just feel a little tired, some creature bit me. But it's ok." },
    { speaker: "Brother", text: "Bit you...?" },
    { speaker: "You", text: "Yeah but that's nothing to care about." },
    { speaker: "Brother", text: "Of course it's something to care about! Let me see your eyes." },
    { speaker: "Brother", text: "That's what I thought. Your eyes are so red... You're infected." },
    { speaker: "You", text: "Infected? You mean I'll become one of them?" },
    { speaker: "Brother", text: "One of us..." },
    { speaker: "You", text: "You're infected too...?!" },
    { speaker: "Brother", text: "Yeah, we were only two survivors, my doctor and I. We barricaded ourselves in this corridor." },
    { speaker: "You", text: "Now that I think about it I saw an infected in the room next door..." },
    { speaker: "Brother", text: "We tried to leave the hospital but we were attacked, we got infected." },
    { speaker: "Brother", text: "I don't know why, but my symptoms took a lot longer than his to develop." },
    { speaker: "Brother", text: "While searching why I resisted to the infection, my doctor found an antidote." },
    { speaker: "You", text: "Amazing! Where is it??" },
    { speaker: "Brother", text: "That's the problem... Frederic didn't finish the antidote. He needed a last ingredient." },
    { speaker: "You", text: "Wait, Frederic? Is that the name of your doctor?" },
    { speaker: "Brother", text: "Yes, why?" },
    { speaker: "You", text: "I found a paper from a certain Dr. Frederic Bloupin. There was a bottle with it." },
    { speaker: "Brother", text: "Are you kiding me? So you have the final piece! We can escape from here safely!" },
    { speaker: "You", text: "Finally some good news..." },

    { speaker: "Pause", text: "A few moments later..." },

    { speaker: "You", text: "It's done but..." },
    { speaker: "Brother", text: "We only have one dose of remedy." },
    { speaker: "You", text: "..." },
    { speaker: "Brother", text: "..." },
    { speaker: "You", text: "You should take it." },
    { speaker: "Brother", text: "No, you should! You have better chances of survival." },
    { speaker: "You", text: "But you were here for so long waiting to escape..." },
    { speaker: "Brother", text: "Take it." },
    { speaker: "Pause", text: "Make a choice\nPress Y to save your Brother. Press N to save yourself." }
];

const selfish = [
    { speaker: "Brother", text: "Go and live a long life. I'll miss you." },
    { speaker: "Pause", text: "You took the remedy and left the hospital. An infected attacked you and wounded you to death. You died alone in the parking lot of the hospital, while your brother fell asleep for an endless night.\nBad ending..." }
];

const victory = [
    { speaker: "Brother", text: "I can't take it, you came all the way here for me..." },
    { speaker: "You", text: "You are my little brother. It's my duty to protect you." },
    { speaker: "Pause", text: "Your brother took the remedy. While you helped him escape the hospital, he saw a locker looking quite familiar to him. It was Frederic's locker! You found an other dose of the remedy and escaped together safely.\nCongratulations!" }
];

let currentDialogue = dialogues;

// ------------------- Trigger Function -------------------

const corridorDoorTrigger = new THREE.Box3(
    new THREE.Vector3(-2.9, 0, -4.3),
    new THREE.Vector3(-0.5, 3.5, -3.7)
)

const brotherTrigger = new THREE.Box3(
    new THREE.Vector3(-3, 0, -2.5),
    new THREE.Vector3(-1, 4, 1.5)
)

function updateDialogue(currentDialogue) {
    if (currentDialogue.speaker === "Pause") {
        dialogueContainer.style.display = 'none'; // Cache la boîte de dialogue normale
        pauseOverlay.style.display = 'flex';      // Affiche l'écran noir de pause
        pauseText.innerText = currentDialogue.text; // Affiche le texte en grand sur l'écran noir
    }
    else {
        dialogueSpeaker.innerText = currentDialogue.speaker
        dialogueSpeaker.style.color = currentDialogue.speaker === "You" ? "green" : "#ffcc00"; // Vert si le joueur parle, jaune sinon
        dialogueText.innerText = currentDialogue.text;
    }
}

function showDialogue() {
    launchDialogue.style.visibility = 'hidden'
    startDialogue = true;
    dialogueContainer.style.display = 'block';
    blurred.style.display = 'block';
    exitPrompt.style.display = 'block';
    pauseOverlay.style.display = 'none';
}

function hideDialogue() {
    launchDialogue.style.visibility = 'visible'
    startDialogue = false;
    dialogueContainer.style.display = 'none';
    blurred.style.display = 'none';
    exitPrompt.style.display = 'none';
    pauseOverlay.style.display = 'none';
}

function brotherDialogue() {
    if (playerInBrotherTriggerZone & currentDialogueIndex < currentDialogue.length) {
        showDialogue();
        updateDialogue(currentDialogue[currentDialogueIndex]);
        currentDialogueIndex++;
    }
    else if (playerInBrotherTriggerZone & currentDialogueIndex >= currentDialogue.length) {
    }
}

function exitDialogue() {
    if (startDialogue) {
        hideDialogue();
    }
}

function finalDialogue(response) {
    currentDialogueIndex = 0;
    if (response) {
        currentDialogue = victory;
        brotherDialogue()
    }
    else {
        currentDialogue = selfish;
        brotherDialogue()
    }
}

function intersectobject(playerBox, Trigger, inTrigger, text) {
    if (playerBox.intersectsBox(Trigger)) {
        if (!inTrigger) {
            console.log("Entered the trigger zone");
            text.style.visibility = "visible";
            return true;
        }
    }
    else {
        if (inTrigger) {
            console.log("Exited the trigger zone");
            text.style.visibility = "hidden";
            return false;
        }
    }
    return inTrigger;
}

function roomTriggers(playerBox) {
    if (!startDialogue) {
        // Check for door trigger collision
        if (playerBox.intersectsBox(corridorDoorTrigger)) {
            loadNewRoom("corridor");
        }
        playerInBrotherTriggerZone = intersectobject(playerBox, brotherTrigger, playerInBrotherTriggerZone, launchDialogue)
    }
}


export { roomTriggers, brotherDialogue, exitDialogue, finalDialogue };