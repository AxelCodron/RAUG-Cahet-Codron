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
    { speaker: "Brother", text: "You came all the way here for me ? Are you ok ?" },
    { speaker: "You", text: "Of course I did. I was attacked but it's ok. I just feel a little tired." },
    { speaker: "Brother", text: "Tired...?" },
    { speaker: "You", text: "Yeah but that's nothing to care about." },
    { speaker: "Brother", text: "You were attacked by one of them, let me see your eyes." },
    { speaker: "Brother", text: "That's what I thought. You are infected." },
    { speaker: "You", text: "Infected ? You mean I will transform into one of them ?" },
    { speaker: "Brother", text: "One of us..." },
    { speaker: "You", text: "You too are infected...?!" },
    { speaker: "Brother", text: "Yeah, we were 2 survivors with my doctor and we barricaded ourselves in this corridor." },
    { speaker: "You", text: "But i saw an infected in the room next door." },
    { speaker: "Brother", text: "We tried to escape but we were attacked, we got infected." },
    { speaker: "Brother", text: "I don't know why my symptoms took a lot longer than his to develop." },
    { speaker: "Brother", text: "By leading research on why i was less affected, my doctor found an antidote." },
    { speaker: "You", text: "Amazing ! where is it ??" },
    { speaker: "Brother", text: "That's the problem... Frederic didn't finish the antidote. He needed a last component." },
    { speaker: "You", text: "Wait, Frederic ? is it the name of your doctor ?" },
    { speaker: "Brother", text: "Yes, why ?" },
    { speaker: "You", text: "I found a paper from a certain dr. Frederic Bloupin. There was a bottle with it." },
    { speaker: "Brother", text: "Are you kiding me ? so you got the final ingredient ! We can escape from here safely !" },
    { speaker: "You", text: "Finally a good news..." },

    { speaker: "Pause", text: "A few moments later..." },

    { speaker: "You", text: "We finalised it but..." },
    { speaker: "Brother", text: "We only have one dose of remedy." },
    { speaker: "You", text: "..." },
    { speaker: "Brother", text: "..." },
    { speaker: "You", text: "You should take it." },
    { speaker: "Brother", text: "No, you should, you have better chance to survive." },
    { speaker: "You", text: "But you were here for so long waiting for leaving..." },
    { speaker: "Brother", text: "Take it." },
    { speaker: "Pause", text: "Make a choice\nPress O to save your Brother. Press N to save yourselve." }
];

const selfish = [
    { speaker: "Brother", text: "Go and live a long life." },
    { speaker: "Pause", text: "You took the remedy and leave the hospital. An infected attacked you and wounds you to death. You died lonely on the parking of the hospital, while you brother falls asleep for an endless sleep.\nYou lose..." }
];

const victory = [
    { speaker: "Brother", text: "I can't take it, you came all the way here for me..." },
    { speaker: "You", text: "You are my little brother. It's my duty to protect you."},
    { speaker: "Pause", text: "Your brother take the remedy. While you help him escape the hospital, he sees a locker looking familiar to him. It was Frederic's locker. You found other dose of the remedy and escaped together safely.\nCongratulations !"}
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

function brotherDialogue(){
    if (playerInBrotherTriggerZone & currentDialogueIndex < currentDialogue.length) {
        showDialogue();
        updateDialogue(currentDialogue[currentDialogueIndex]);
        currentDialogueIndex++;
    }
    else if (playerInBrotherTriggerZone & currentDialogueIndex >= currentDialogue.length) {
    }
}

function exitDialogue(){
    if (startDialogue) {
        hideDialogue();
    }
}

function finalDialogue(response) {
    currentDialogueIndex = 0;
    if (response == "O") {
        currentDialogue = victory;
        brotherDialogue()
    }
    if (response == "N") {
        currentDialogue = selfish;
        brotherDialogue()
    }
}

function intersectobject(playerBox, Trigger, inTrigger, text)
{
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
    if (!startDialogue){
        // Check for door trigger collision
        if (playerBox.intersectsBox(corridorDoorTrigger)) {
            loadNewRoom("corridor");
        }
        playerInBrotherTriggerZone = intersectobject(playerBox, brotherTrigger, playerInBrotherTriggerZone, launchDialogue)
    }
}


export { roomTriggers, brotherDialogue, exitDialogue, finalDialogue };