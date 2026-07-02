function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Pad single digit numbers with a leading zero
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // 24-hour display layout
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Run immediately on load, then tick every second
updateClock();
setInterval(updateClock, 1000);