function updateClock() {
    const clockElement = document.getElementById('clock');
    const greetingElement = document.getElementById('greeting');
    const dateElement = document.getElementById('date');
    
    const now = new Date();
    
    // 1. Time Logic
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    // 2. Greeting Logic
    let greeting = "Good evening";
    if (now.getHours() < 12) {
        greeting = "Good morning";
    } else if (now.getHours() < 18) {
        greeting = "Good afternoon";
    }
    if (greetingElement) greetingElement.textContent = greeting;

    // 3. Date Logic
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', options);
}

updateClock();
setInterval(updateClock, 1000);