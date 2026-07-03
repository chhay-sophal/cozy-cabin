// Default shortcut configuration if storage is pristine empty
const DEFAULT_LINKS = [
    { emoji: "🐙", url: "https://github.com" },
    { emoji: "🦊", url: "https://gitlab.com" },
    { emoji: "📅", url: "https://calendar.google.com" }
];

// Read from LocalStorage or fall back to array configurations
let userLinks = JSON.parse(localStorage.getItem('custom-dock-links')) || DEFAULT_LINKS;

const linksContainer = document.getElementById('dynamic-links');
const modal = document.getElementById('settings-modal');
const editorList = document.getElementById('links-editor-list');

// 1. Render Links to the Dock
function renderDock() {
    linksContainer.innerHTML = '';
    userLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.emoji;
        anchor.title = link.url;
        linksContainer.appendChild(anchor);
    });
}

// 2. Render Interactive Inputs Inside Editor List Container
function renderEditor() {
    editorList.innerHTML = '';
    userLinks.forEach((link, index) => {
        const row = document.createElement('div');
        row.className = 'link-row';
        row.innerHTML = `
            <input type="text" class="input-emoji" value="${link.emoji}" maxlength="2" placeholder="Icon">
            <input type="url" class="input-url" value="${link.url}" placeholder="https://...">
            <button class="glass-btn remove-btn" data-index="${index}">✕</button>
        `;
        editorList.appendChild(row);
    });
}

// 3. Setup Modal Toggle Event Bindings
document.getElementById('open-settings-btn').addEventListener('click', () => {
    renderEditor();
    modal.classList.add('active');
});

// Handle removals and structural changes inside editor UI dynamically
editorList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const idx = parseInt(e.target.getAttribute('data-index'));
        userLinks.splice(idx, 1);
        renderEditor();
    }
});

document.getElementById('add-link-btn').addEventListener('click', () => {
    userLinks.push({ emoji: "🔗", url: "https://" });
    renderEditor();
});

// 4. Save Changes to LocalStorage and Reload Dock Frame Canvas
document.getElementById('save-links-btn').addEventListener('click', () => {
    const rows = editorList.getElementsByClassName('link-row');
    const updatedLinks = [];

    for (let row of rows) {
        const emoji = row.querySelector('.input-emoji').value.trim();
        const url = row.querySelector('.input-url').value.trim();
        
        if (emoji && url) {
            updatedLinks.push({ emoji, url });
        }
    }

    userLinks = updatedLinks;
    localStorage.setItem('custom-dock-links', JSON.stringify(userLinks));
    
    renderDock();
    modal.classList.remove('active');
});

// Close modal if user clicks on the dark backdrop boundary overlay mask
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// Initialize Dock Render on Document Load Completion Trigger Event
renderDock();

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