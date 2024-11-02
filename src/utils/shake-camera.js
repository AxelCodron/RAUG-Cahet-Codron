// Functions to adapt the camera

const overlay = document.getElementById('damage-overlay');

function flashRed() {
    overlay.style.opacity = '0.8';

    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.classList.remove('fade-out');
        }, 1000);
    }, 200);
}

export { flashRed };