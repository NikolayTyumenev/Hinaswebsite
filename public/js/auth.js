// Authentication system for Hina's Journal
let isLoggedIn = false;
let currentUser = null;

// Check if user is already logged in
function checkLoginStatus() {
    // Check both storage types - localStorage for "Remember Me" and sessionStorage for session-only
    const savedLoginPermanent = localStorage.getItem('hinaJournalLogin');
    const savedLoginSession = sessionStorage.getItem('hinaJournalLogin');
    
    if (savedLoginPermanent === 'true' || savedLoginSession === 'true') {
        isLoggedIn = true;
        currentUser = 'Hina';
        updateUIForLoggedInUser();
        
        // Explicitly call showDiaryNavigation to ensure diary is in navigation
        showDiaryNavigation();
    }
}

// Create login modal
function createLoginModal() {
    const modal = document.createElement('div');
    modal.classList.add('login-modal');
    modal.innerHTML = `
        <div class="login-content">
            <div class="login-header">
                <h2>Welcome to Hina's Journal</h2>
                <p>Please login to edit content</p>
            </div>
            <div class="login-form">
                <input type="text" id="username" placeholder="Username" class="login-input">
                <input type="password" id="password" placeholder="Password" class="login-input">
                <div class="remember-me-container">
                    <input type="checkbox" id="rememberMe" checked>
                    <label for="rememberMe">Remember me</label>
                </div>
                <button id="loginBtn" class="login-button">Login</button>
                <button id="closeLogin" class="close-login">Just Browsing</button>
            </div>
            <div class="login-decoration">
                <div class="login-cat"></div>
                <div class="login-yarn"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('closeLogin').addEventListener('click', () => {
        modal.remove();
    });
    
    // Enter key to submit
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
}

// Handle login attempt
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    if (username === 'Hina' && password === 'HinaMajboor123!') {
        isLoggedIn = true;
        currentUser = 'Hina';
        
        // Store login state in appropriate storage
        if (rememberMe) {
            localStorage.setItem('hinaJournalLogin', 'true');
        } else {
            sessionStorage.setItem('hinaJournalLogin', 'true');
        }
        
        // Show success message
        const modal = document.querySelector('.login-modal');
        modal.innerHTML = `
            <div class="login-content">
                <div class="login-success">
                    <h2>Welcome back, Hina! 💜</h2>
                    <p>You can now edit your journal</p>
                    <div class="success-animation">✨</div>
                </div>
            </div>
        `;
        
        // Update UI immediately - don't wait for timeout
        updateUIForLoggedInUser();
        
        // Explicitly add diary bookmark
        showDiaryNavigation();
        
        // Finish modal timeout
        setTimeout(() => {
            modal.remove();
            
            // Add diary again after modal is removed (double-check)
            showDiaryNavigation();
            
            // Force a refresh of the navigation
            const bookmarkContainer = document.querySelector('.bookmark-container');
            if (bookmarkContainer) {
                bookmarkContainer.style.display = 'none';
                setTimeout(() => {
                    bookmarkContainer.style.display = '';
                }, 10);
            }
        }, 1500);
    } else {
        // Show error
        const loginForm = document.querySelector('.login-form');
        const error = document.createElement('p');
        error.classList.add('login-error');
        error.textContent = 'Invalid username or password';
        if (!loginForm.querySelector('.login-error')) {
            loginForm.appendChild(error);
        }
    }
}

// Update UI for logged-in user
function updateUIForLoggedInUser() {
    // Show edit buttons on all pages
    if (isLoggedIn) {
        // Add login indicator
        addLoginIndicator();
        
        // Enable editing features
        enableEditingFeatures();
        
        // Add logout button
        addLogoutButton();
    }
}

// Add login indicator
function addLoginIndicator() {
    if (!document.querySelector('.login-indicator')) {
        const indicator = document.createElement('div');
        indicator.classList.add('login-indicator');
        indicator.innerHTML = `
            <span>Logged in as Hina</span>
            <div class="indicator-yarn"></div>
        `;
        document.body.appendChild(indicator);
    }
}

// Enable editing features
function enableEditingFeatures() {
    // Show new entry forms
    const newThoughtBox = document.querySelector('.new-thought-box');
    const newDreamBox = document.querySelector('.new-dream-box');
    const newDiaryEntry = document.querySelector('.new-diary-entry');
    const diaryLock = document.querySelector('.diary-lock');
    
    if (newThoughtBox) newThoughtBox.style.display = 'block';
    if (newDreamBox) newDreamBox.style.display = 'block';
    if (newDiaryEntry) newDiaryEntry.style.display = 'block';
    if (diaryLock) diaryLock.style.display = 'none';
    
    // Add edit buttons to existing content
    addEditButtons();
}

// Add edit buttons to existing content
function addEditButtons() {
    // Add edit buttons to thought entries
    const thoughtEntries = document.querySelectorAll('.thought-entry');
    thoughtEntries.forEach(entry => {
        if (!entry.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => editContent(entry));
            entry.appendChild(editBtn);
        }
    });
    
    // Add edit buttons to dream clouds
    const dreamClouds = document.querySelectorAll('.dream-cloud');
    dreamClouds.forEach(cloud => {
        if (!cloud.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => editContent(cloud));
            cloud.appendChild(editBtn);
        }
    });
}

// Edit content function
function editContent(element) {
    const content = element.querySelector('p');
    if (content) {
        const currentText = content.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.classList.add('edit-textarea');
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('save-edit-btn');
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.classList.add('cancel-edit-btn');
        
        content.style.display = 'none';
        element.appendChild(textarea);
        element.appendChild(saveBtn);
        element.appendChild(cancelBtn);
        
        saveBtn.addEventListener('click', () => {
            content.textContent = textarea.value;
            content.style.display = 'block';
            textarea.remove();
            saveBtn.remove();
            cancelBtn.remove();
        });
        
        cancelBtn.addEventListener('click', () => {
            content.style.display = 'block';
            textarea.remove();
            saveBtn.remove();
            cancelBtn.remove();
        });
    }
}

// Add logout button
function addLogoutButton() {
    if (!document.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.classList.add('logout-btn');
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', handleLogout);
        document.body.appendChild(logoutBtn);
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    // Clear both storage types to ensure complete logout
    localStorage.removeItem('hinaJournalLogin');
    sessionStorage.removeItem('hinaJournalLogin');
    location.reload();
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Add login button if not logged in
    if (!isLoggedIn) {
        const loginBtn = document.createElement('button');
        loginBtn.classList.add('login-prompt-btn');
        loginBtn.textContent = 'Login';
        loginBtn.addEventListener('click', createLoginModal);
        document.body.appendChild(loginBtn);
        
        // Hide editing features
        const newThoughtBox = document.querySelector('.new-thought-box');
        const newDreamBox = document.querySelector('.new-dream-box');
        const newDiaryEntry = document.querySelector('.new-diary-entry');
        
        if (newThoughtBox) newThoughtBox.style.display = 'none';
        if (newDreamBox) newDreamBox.style.display = 'none';
        if (newDiaryEntry) newDiaryEntry.style.display = 'none';
    } else {
        // Ensure diary navigation is visible if logged in
        setTimeout(showDiaryNavigation, 300);
    }
});