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

// --- ENGINE MANAGEMENT CONFIGURATIONS ---
const SEARCH_ENGINES = {
    google: { name: 'Google', url: 'https://www.google.com/search' },
    bing: { name: 'Bing', url: 'https://www.bing.com/search' },
    duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/' }
};

let currentEngine = localStorage.getItem('search-engine') || 'google';
let selectedEngineTemp = currentEngine;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Custom Dropdown Elements 
const dropdownContainer = document.getElementById('custom-dropdown');
const dropdownTriggerText = document.getElementById('dropdown-trigger-text');
const optionItems = document.querySelectorAll('.dropdown-option-item');

function applySearchEngine() {
    const engineData = SEARCH_ENGINES[currentEngine];
    if (searchForm && searchInput) {
        searchForm.setAttribute('action', engineData.url);
        searchInput.placeholder = `Search ${engineData.name}...`;
    }
}

function updateDropdownUI(value) {
    selectedEngineTemp = value;
    if (dropdownTriggerText) {
        dropdownTriggerText.textContent = SEARCH_ENGINES[value].name;
    }
    
    optionItems.forEach(item => {
        if (item.getAttribute('data-value') === value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Safely configure Dropdown Listeners if structure context exists
if (dropdownContainer) {
    const triggerZone = dropdownContainer.querySelector('.custom-dropdown-trigger');
    
    if (triggerZone) {
        triggerZone.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents instant window body collapse closure triggers
            dropdownContainer.classList.toggle('open');
        });
    }

    optionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = item.getAttribute('data-value');
            if (val) {
                updateDropdownUI(val);
                dropdownContainer.classList.remove('open');
            }
        });
    });

    // Close options window when clicking anywhere outside the component zone
    window.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
            dropdownContainer.classList.remove('open');
        }
    });
}

// Hook directly into your existing Modal Trigger Configuration
document.getElementById('open-settings-btn').addEventListener('click', () => {
    updateDropdownUI(currentEngine);
    renderEditor();
    modal.classList.add('active');
});

// Update Save Handler to commit standard configurations smoothly
document.getElementById('save-links-btn').addEventListener('click', () => {
    // 1. Core Quick Links Logic Execution Pipeline
    const rows = editorList.getElementsByClassName('link-row');
    const updatedLinks = [];
    for (let row of rows) {
        const emoji = row.querySelector('.input-emoji').value.trim();
        const url = row.querySelector('.input-url').value.trim();
        if (emoji && url) updatedLinks.push({ emoji, url });
    }
    userLinks = updatedLinks;
    localStorage.setItem('custom-dock-links', JSON.stringify(userLinks));
    renderDock();

    // 2. Commit Engine Selection safely to storage
    currentEngine = selectedEngineTemp;
    localStorage.setItem('search-engine', currentEngine);
    applySearchEngine();

    if (dropdownContainer) dropdownContainer.classList.remove('open');
    modal.classList.remove('active');
});

// Run Initial App configuration states on system mount load
applySearchEngine();

// --- AMBIENT SOUND MIXER STATE ---
const soundStates = {
    fireplace: localStorage.getItem('sound-fireplace') === 'true',
    rain: localStorage.getItem('sound-rain') === 'true',
    lofi: localStorage.getItem('sound-lofi') === 'true'
};

const soundCards = document.querySelectorAll('.sound-card');

// Synchronize sound tracks to match structural state rules
function syncAudioPlayback() {
    Object.keys(soundStates).forEach(key => {
        const audioElement = document.getElementById(`audio-${key}`);
        if (!audioElement) return;

        if (soundStates[key]) {
            // Play track safely, ignoring promise interruptions if the user hasn't clicked anything yet
            audioElement.play().catch(() => {
                console.log(`Audio playback for ${key} is queued, waiting for user click interaction.`);
            });
        } else {
            audioElement.pause();
        }
    });
}

// Initial Sync helper for the layout button highlighting
function updateMixerUI() {
    soundCards.forEach(card => {
        const soundKey = card.getAttribute('data-sound');
        if (soundStates[soundKey]) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Bind interactive toggle clicks to the option cards
soundCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const soundKey = card.getAttribute('data-sound');
        
        // Flip state logic dynamically
        soundStates[soundKey] = !soundStates[soundKey];
        
        // Update live interface indicators and execute preview immediately
        updateMixerUI();
        syncAudioPlayback();
    });
});

// --- INTEGRATION WITH EXISTING OPEN/SAVE HANDLERS ---

// Sync UI when opening settings menu
document.getElementById('open-settings-btn').addEventListener('click', () => {
    updateMixerUI();
    // ... rest of your existing quick links/search engine display logic[cite: 3]
});

// Permanently save state options when user clicks save
document.getElementById('save-links-btn').addEventListener('click', () => {
    // Save configuration variables cleanly to local data tables
    Object.keys(soundStates).forEach(key => {
        localStorage.setItem(`sound-${key}`, soundStates[key]);
    });
    
    syncAudioPlayback();
    // ... rest of your existing saving logic[cite: 3]
});

// Trigger setup on page initialization
updateMixerUI();

// Auto-activate saved channels instantly if user interacts with page anywhere
window.addEventListener('click', () => {
    syncAudioPlayback();
}, { once: true }); // Runs only once to bypass browser audio restrictions safely