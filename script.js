// Global variables
let zIndex = 10;
let openWindows = [];
let clockInterval;

// Update clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
clockInterval = setInterval(updateClock, 1000);

// Desktop icons
const desktopIcons = [
    { name: 'This PC', icon: 'fas fa-desktop', action: () => openApp('This PC') },
    { name: 'Recycle Bin', icon: 'fas fa-trash', action: () => openApp('Recycle Bin') },
    { name: 'Documents', icon: 'fas fa-folder', action: () => openApp('Documents') },
];

desktopIcons.forEach(icon => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.innerHTML = `<i class="${icon.icon} fa-2x"></i><span>${icon.name}</span>`;
    iconDiv.addEventListener('dblclick', icon.action);
    document.getElementById('desktop').appendChild(iconDiv);
});

// Start menu
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

startButton.addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startButton) {
        startMenu.classList.add('hidden');
    }
});

// Pinned apps in start menu (focused on useful ones)
const pinnedApps = [
    { name: 'VS Code Web', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', action: () => openApp('VS Code Web'), real: true },
    { name: 'Online Calculator', icon: 'fas fa-calculator', action: () => openApp('Online Calculator'), real: true },
    { name: 'Online Notepad', icon: 'fas fa-edit', action: () => openApp('Online Notepad'), real: true },
    { name: 'Online Terminal', icon: 'fas fa-terminal', action: () => openApp('Online Terminal'), real: true },
    { name: 'File Explorer', icon: 'fas fa-folder-open', action: () => openApp('File Explorer'), real: true },
    { name: 'Settings', icon: 'fas fa-cog', action: () => openApp('Settings'), real: false },
];

// All apps (includes placeholders for Windows feel)
const allApps = [
    ...pinnedApps,
    { name: 'Microsoft Edge', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/edge/edge-original.svg', action: () => showPopup('Microsoft Edge', 'Coming Soon - Under Development'), real: false },
    { name: 'Word', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftword/microsoftword-original.svg', action: () => showPopup('Word', 'Coming Soon - Under Development'), real: false },
    { name: 'Excel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/excel/excel-original.svg', action: () => showPopup('Excel', 'Coming Soon - Under Development'), real: false },
    { name: 'PowerPoint', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powerpoint/powerpoint-original.svg', action: () => showPopup('PowerPoint', 'Coming Soon - Under Development'), real: false },
];

// Populate start menu
function populateStartMenu() {
    const pinnedContainer = document.getElementById('pinned-apps');
    const allContainer = document.getElementById('all-apps');
    pinnedContainer.innerHTML = '';
    allContainer.innerHTML = '';

    pinnedApps.forEach(app => {
        const appDiv = document.createElement('div');
        appDiv.className = 'app-icon';
        appDiv.innerHTML = `<img src="${app.icon}" alt="${app.name}" style="width:40px; height:40px;"><span>${app.name}</span>`;
        appDiv.addEventListener('click', () => {
            app.action();
            startMenu.classList.add('hidden');
        });
        pinnedContainer.appendChild(appDiv);
    });

    allApps.forEach(app => {
        const appDiv = document.createElement('div');
        appDiv.className = 'app-icon';
        appDiv.innerHTML = `<img src="${app.icon}" alt="${app.name}" style="width:40px; height:40px;"><span>${app.name}</span>`;
        appDiv.addEventListener('click', () => {
            app.action();
            startMenu.classList.add('hidden');
        });
        allContainer.appendChild(appDiv);
    });
}
populateStartMenu();

// Show popup for placeholders
function showPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `<h3>${title}</h3><p>${message}</p><button onclick="this.parentElement.remove()">OK</button>`;
    document.body.appendChild(popup);
}

// Power options
document.getElementById('shutdown').addEventListener('click', () => {
    alert('Shutting down... (Simulation)');
});

// Open app function
function openApp(appName) {
    if (openWindows.includes(appName)) {
        // Bring to front
        const windowEl = document.querySelector(`.window[data-app="${appName}"]`);
        windowEl.style.zIndex = ++zIndex;
        return;
    }
    openWindows.push(appName);

    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.setAttribute('data-app', appName);
    windowEl.style.zIndex = ++zIndex;
    windowEl.innerHTML = `
        <div class="window-header">
            <span>${appName}</span>
            <div class="window-controls">
                <button class="minimize">-</button>
                <button class="maximize">□</button>
                <button class="close">×</button>
            </div>
        </div>
        <div class="window-content">${getAppContent(appName)}</div>
    `;

    document.getElementById('windows-container').appendChild(windowEl);

    // Add to taskbar
    const taskbarIcon = document.createElement('div');
    taskbarIcon.className = 'taskbar-icon active';
    taskbarIcon.innerHTML = `<i class="${getAppIcon(appName)}"></i>`;
    taskbarIcon.addEventListener('click', () => {
        if (windowEl.style.display === 'none') {
            windowEl.style.display = 'flex';
            taskbarIcon.classList.add('active');
        } else {
            windowEl.style.display = 'none';
            taskbarIcon.classList.remove('active');
        }
    });
    document.getElementById('taskbar-apps').appendChild(taskbarIcon);

    // Window controls
    windowEl.querySelector('.minimize').addEventListener('click', () => {
        windowEl.style.display = 'none';
        taskbarIcon.classList.remove('active');
    });
    windowEl.querySelector('.maximize').addEventListener('click', () => {
        if (windowEl.style.width === '100%') {
            windowEl.style.width = '300px';
            windowEl.style.height = '200px';
            windowEl.style.top = '50px';
            windowEl.style.left = '50px';
        } else {
            windowEl.style.width = '100%';
            windowEl.style.height = 'calc(100vh - 48px)';
            windowEl.style.top = '0';
            windowEl.style.left = '0';
        }
    });
    windowEl.querySelector('.close').addEventListener('click', () => {
        windowEl.remove();
        taskbarIcon.remove();
        openWindows = openWindows.filter(w => w !== appName);
    });

    // Make draggable and resizable with Interact.js
    interact(windowEl).draggable({
        allowFrom: '.window-header',
        listeners: {
            move: function (event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    }).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move: function (event) {
                const target = event.target;
                let x = (parseFloat(target.getAttribute('data-x')) || 0);
                let y = (parseFloat(target.getAttribute('data-y')) || 0);
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
}

// Helper functions
function getAppContent(appName) {
    switch (appName) {
        case 'VS Code Web':
            return '<div class="loading">Loading VS Code...</div><iframe src="https://vscode.dev/" onload="this.previousElementSibling.style.display=\'none\'" onerror="this.previousElementSibling.innerHTML=\'Unable