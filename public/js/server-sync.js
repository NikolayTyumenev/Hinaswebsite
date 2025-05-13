// Server Sync functionality for Hina's Journal
// This script handles syncing data between localStorage and server storage

// Server API URL - Change this to your actual server URL
const SERVER_API_URL = '../php/server.php';

// Data types to sync
const DATA_TYPES = [
    'hinaThoughts',
    'hinaDreams',
    'hinaDiaryEntries',
    'hinaGalleryPhotos',
    'hinaMemoryJar'
];

// Check if server sync is available
async function checkServerAvailability() {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'load', dataType: 'test' })
        });
        
        if (response.ok) {
            return true;
        }
    } catch (err) {
        console.log('Server sync not available:', err);
    }
    
    return false;
}

// Login to the server
async function serverLogin(username, password) {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'login',
                auth: {
                    username: username,
                    password: password
                }
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Save auth token to sessionStorage
            sessionStorage.setItem('hinaServerAuth', JSON.stringify({
                username: username,
                password: password
            }));
            
            return true;
        }
    } catch (err) {
        console.log('Server login failed:', err);
    }
    
    return false;
}

// Save data to server
async function saveToServer(dataType, data) {
    const auth = JSON.parse(sessionStorage.getItem('hinaServerAuth') || 'null');
    
    if (!auth) {
        console.log('Not authenticated for server sync');
        return false;
    }
    
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'save',
                dataType: dataType,
                data: data,
                auth: auth
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (err) {
        console.log(`Failed to save ${dataType} to server:`, err);
        return false;
    }
}

// Load data from server
async function loadFromServer(dataType) {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'load',
                dataType: dataType
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        }
    } catch (err) {
        console.log(`Failed to load ${dataType} from server:`, err);
    }
    
    return null;
}

// Sync all data between localStorage and server
async function syncAllData() {
    const serverAvailable = await checkServerAvailability();
    
    if (!serverAvailable) {
        console.log('Server sync not available');
        return;
    }
    
    const auth = JSON.parse(sessionStorage.getItem('hinaServerAuth') || 'null');
    
    if (!auth) {
        console.log('Not authenticated for server sync');
        return;
    }
    
    // Show sync indicator
    showSyncIndicator();
    
    for (const dataType of DATA_TYPES) {
        // Load data from localStorage
        const localData = JSON.parse(localStorage.getItem(dataType) || 'null');
        
        // Load data from server
        const serverData = await loadFromServer(dataType);
        
        if (localData && (!serverData || isNewer(localData, serverData))) {
            // Local data is newer, save to server
            await saveToServer(dataType, localData);
            console.log(`Synced ${dataType} to server`);
        } else if (serverData && (!localData || isNewer(serverData, localData))) {
            // Server data is newer, save to localStorage
            localStorage.setItem(dataType, JSON.stringify(serverData));
            console.log(`Synced ${dataType} from server to local`);
        } else {
            console.log(`${dataType} is already in sync`);
        }
    }
    
    // Hide sync indicator
    hideSyncIndicator();
    
    // Show success notification
    showSyncNotification('All data synced successfully');
}

// Helper function to determine if data1 is newer than data2
function isNewer(data1, data2) {
    // This is a simplistic approach assuming data is an array with objects that have timestamps
    // For real-world use, you would need a more sophisticated approach based on your data structure
    
    // If data is an array, compare timestamps of the most recent item
    if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length === 0) return false;
        if (data2.length === 0) return true;
        
        const latestData1 = data1.reduce((latest, item) => {
            const timestamp = item.timestamp || item.id || 0;
            return timestamp > latest ? timestamp : latest;
        }, 0);
        
        const latestData2 = data2.reduce((latest, item) => {
            const timestamp = item.timestamp || item.id || 0;
            return timestamp > latest ? timestamp : latest;
        }, 0);
        
        return latestData1 > latestData2;
    }
    
    // If data is an object (e.g., hinaGalleryPhotos), compare number of keys
    if (typeof data1 === 'object' && typeof data2 === 'object') {
        return Object.keys(data1).length > Object.keys(data2).length;
    }
    
    // Default fallback
    return true;
}

// Create a backup of all data
async function createBackup() {
    const auth = JSON.parse(sessionStorage.getItem('hinaServerAuth') || 'null');
    
    if (!auth) {
        console.log('Not authenticated for backup');
        return null;
    }
    
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'backup',
                auth: auth
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            // Format date for filename
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const filename = `hina-journal-backup-${dateStr}.json`;
            
            // Create download link
            const dataStr = JSON.stringify(result.data);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(dataBlob);
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            return true;
        }
    } catch (err) {
        console.log('Backup failed:', err);
    }
    
    return false;
}

// Restore data from backup file
async function restoreFromBackup(backupFile) {
    const auth = JSON.parse(sessionStorage.getItem('hinaServerAuth') || 'null');
    
    if (!auth) {
        console.log('Not authenticated for restore');
        return false;
    }
    
    try {
        const fileReader = new FileReader();
        
        const readFilePromise = new Promise((resolve, reject) => {
            fileReader.onload = (event) => resolve(event.target.result);
            fileReader.onerror = (error) => reject(error);
        });
        
        fileReader.readAsText(backupFile);
        const backupContent = await readFilePromise;
        const backupData = JSON.parse(backupContent);
        
        // Restore to server
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'restore',
                data: backupData,
                auth: auth
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Also restore to localStorage
            for (const dataType in backupData) {
                localStorage.setItem(dataType, JSON.stringify(backupData[dataType]));
            }
            
            return true;
        }
    } catch (err) {
        console.log('Restore failed:', err);
    }
    
    return false;
}

// UI Elements for sync
function showSyncIndicator() {
    if (!document.querySelector('.sync-indicator')) {
        const syncIndicator = document.createElement('div');
        syncIndicator.className = 'sync-indicator';
        syncIndicator.innerHTML = `
            <div class="sync-spinner"></div>
            <span>Syncing data...</span>
        `;
        document.body.appendChild(syncIndicator);
    }
}

function hideSyncIndicator() {
    const syncIndicator = document.querySelector('.sync-indicator');
    if (syncIndicator) {
        syncIndicator.classList.add('fade-out');
        setTimeout(() => {
            if (syncIndicator.parentNode) {
                syncIndicator.parentNode.removeChild(syncIndicator);
            }
        }, 500);
    }
}

function showSyncNotification(message) {
    if (!document.querySelector('.sync-notification')) {
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
}

// Create backup/restore UI
function createBackupUI() {
    if (!document.querySelector('.backup-ui') && isLoggedIn) {
        const backupUI = document.createElement('div');
        backupUI.className = 'backup-ui';
        backupUI.innerHTML = `
            <button class="backup-btn">Create Backup</button>
            <div class="restore-container">
                <label for="restore-file" class="restore-label">Restore from Backup</label>
                <input type="file" id="restore-file" class="restore-file" accept=".json">
            </div>
        `;
        
        // Append to appropriate location
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            document.body.insertBefore(backupUI, logoutBtn.nextSibling);
        } else {
            document.body.appendChild(backupUI);
        }
        
        // Add event listeners
        backupUI.querySelector('.backup-btn').addEventListener('click', async () => {
            const result = await createBackup();
            if (result) {
                showSyncNotification('Backup created successfully');
            } else {
                showSyncNotification('Backup failed');
            }
        });
        
        backupUI.querySelector('.restore-file').addEventListener('change', async (event) => {
            if (event.target.files && event.target.files[0]) {
                const result = await restoreFromBackup(event.target.files[0]);
                if (result) {
                    showSyncNotification('Restore completed successfully');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showSyncNotification('Restore failed');
                }
            }
        });
    }
}

// Add CSS for sync elements
function addSyncStyles() {
    if (!document.querySelector('#sync-styles')) {
        const style = document.createElement('style');
        style.id = 'sync-styles';
        style.textContent = `
            .sync-indicator {
                position: fixed;
                top: 60px;
                right: 20px;
                background: var(--periwinkle);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }
            
            .sync-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid white;
                border-top: 3px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .sync-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--periwinkle);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }
            
            .backup-ui {
                position: fixed;
                top: 60px;
                left: 20px;
                background: white;
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 998;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .backup-btn {
                background: var(--periwinkle);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .backup-btn:hover {
                background: var(--periwinkle-light);
            }
            
            .restore-container {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .restore-label {
                color: var(--text-color);
                font-size: 0.9rem;
                text-align: center;
                cursor: pointer;
            }
            
            .restore-file {
                width: 100%;
                cursor: pointer;
            }
            
            .fade-out {
                animation: fadeOut 0.5s ease forwards;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize sync functionality
document.addEventListener('DOMContentLoaded', function() {
    addSyncStyles();
    
    // Check if server is available and authenticate during login
    const originalHandleLogin = window.handleLogin;
    if (originalHandleLogin) {
        window.handleLogin = async function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // First try to login to the server
            const serverLoginSuccess = await serverLogin(username, password);
            
            // Then do the original login process
            originalHandleLogin.call(this);
            
            // If server login succeeded, sync data
            if (serverLoginSuccess && isLoggedIn) {
                setTimeout(syncAllData, 2000);
                setTimeout(createBackupUI, 2500);
            }
        };
    }
    
    // Setup backup UI if already logged in
    if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
        setTimeout(createBackupUI, 1000);
        
        // Check for server auth and try to sync
        const auth = JSON.parse(sessionStorage.getItem('hinaServerAuth') || 'null');
        if (!auth) {
            // Try to use login credentials to authenticate with server
            const username = 'Hina';
            const password = 'HinaMajboor123!';
            serverLogin(username, password).then(success => {
                if (success) {
                    setTimeout(syncAllData, 1500);
                }
            });
        } else {
            setTimeout(syncAllData, 1500);
        }
    }
    
    // Add autosave and sync
    window.addEventListener('beforeunload', function() {
        // Try to sync data before page unloads
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
            syncAllData();
        }
    });
    
    // Setup periodic sync (every 5 minutes)
    setInterval(() => {
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
            syncAllData();
        }
    }, 5 * 60 * 1000);
});