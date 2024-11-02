import { spawnInfected } from "../main";
import { getKey, removeCodeTrigger } from "../scenes/exterior";
import { playInfectedChase } from "./sounds";

const validCode = "2231";

const codeInput = document.getElementById('code-input');
const solvedCodeText = document.getElementById('solved-code-text');


function clearCode() {
    codeInput.innerText = '';
    removeCodeListener();
}

function checkCode() {
    if (codeInput.innerText === validCode) {
        return true;
    }
    if (codeInput.innerText.length === 4) {
        codeInput.innerText = '';
    }
    return false;
}

function addDigit(digit) {
    if (codeInput.innerText.length < 4) {
        codeInput.innerText += digit;
    }
}

function keyHandler(event) {
    if (event.key >= '0' && event.key <= '9') {
        addDigit(event.key);
    }
    if (event.key === 'Enter') {
        if (checkCode()) {
            console.log('Code accepted');
            codeInput.innerText = 'Correct!';
            solvedCodeText.style.visibility = 'visible';
            getKey();
            spawnInfected();
            playInfectedChase();
            setTimeout(() => {
                removeCodeTrigger();
                codeInput.innerText = '';
                solvedCodeText.style.visibility = 'hidden';
            }, 3000);
        } else {
            console.log('Code rejected');
            codeInput.innerText = 'Wrong!';
            setTimeout(() => {
                codeInput.innerText = '';
            }, 1000);
        }
    }
}

function useCode() {
    document.addEventListener('keyup', keyHandler);
}

function removeCodeListener() {
    document.removeEventListener('keyup', keyHandler);
}


export { checkCode, clearCode, addDigit, useCode };