// Auto-save functionality for Hina's Journal
// This script handles automatic saving of diary content to the server

// Server API URL - Change this to your actual server URL
const SERVER_API_URL = 'php/server.php';

// Data types to auto-save
const DATA_TYPES = [
    'hinaThoughts',
    'hinaDreams',
    'hinaDiaryEntries',
    'hinaGalleryPhotos',
    'hinaMemoryJar'
];

// Check if server is available
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

// Authenticate with server (happens automatically)
async function autoAuthenticate() {
    // Use built-in credentials for simplified experience
    const username = 'Hina';
    const password = 'HinaMajboor123!';
    
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
        console.log('Auto-authentication failed:', err);
    }
    
    return false;
}

// Save data to server
async function saveToServer(dataType, data) {
    // Auto-authenticate if needed
    await autoAuthenticate();
    
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

// Auto-save single item
async function autoSaveItem(dataType) {
    // Get data from localStorage
    const data = JSON.parse(localStorage.getItem(dataType) || 'null');
    
    if (data) {
        // Save to server
        await saveToServer(dataType, data);
    }
}

// Load all data from server
async function loadAllData() {
    const isLoggedIn = localStorage.getItem('hinaJournalLogin') === 'true' || 
                       sessionStorage.getItem('hinaJournalLogin') === 'true';
    
    if (!isLoggedIn) return;
    
    // Check server availability first
    const serverAvailable = await checkServerAvailability();
    if (!serverAvailable) return;
    
    // Auto-authenticate with server
    await autoAuthenticate();
    
    for (const dataType of DATA_TYPES) {
        // Load data from server
        const serverData = await loadFromServer(dataType);
        
        if (serverData) {
            // Get local data
            const localData = JSON.parse(localStorage.getItem(dataType) || 'null');
            
            // Merge data if both exist
            if (localData) {
                if (Array.isArray(localData) && Array.isArray(serverData)) {
                    // For arrays (like diary entries, thoughts), merge by IDs
                    const mergedData = mergeArrays(localData, serverData);
                    localStorage.setItem(dataType, JSON.stringify(mergedData));
                } else if (typeof localData === 'object' && typeof serverData === 'object') {
                    // For objects (like gallery photos), merge by keys
                    const mergedData = { ...serverData, ...localData };
                    localStorage.setItem(dataType, JSON.stringify(mergedData));
                }
            } else {
                // If no local data, just use server data
                localStorage.setItem(dataType, JSON.stringify(serverData));
            }
        }
    }
}

// Helper function to merge arrays by ID
function mergeArrays(arr1, arr2) {
    const idMap = new Map();
    
    // Add all items from arr1
    arr1.forEach(item => {
        const id = item.id || item.timestamp || JSON.stringify(item);
        idMap.set(id, item);
    });
    
    // Add or override with items from arr2
    arr2.forEach(item => {
        const id = item.id || item.timestamp || JSON.stringify(item);
        if (!idMap.has(id)) {
            idMap.set(id, item);
        }
    });
    
    return Array.from(idMap.values());
}

// Monitor localStorage for changes and auto-save
function setupAutoSave() {
    // Original setItem function
    const originalSetItem = localStorage.setItem;
    
    // Override setItem to detect changes
    localStorage.setItem = function(key, value) {
        // Call original function
        originalSetItem.call(this, key, value);
        
        // Auto-save if this is a diary-related item
        if (DATA_TYPES.includes(key)) {
            setTimeout(() => autoSaveItem(key), 500);
        }
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add subtle indicator for server status
    addServerStatusIndicator();
    
    // Setup auto-save
    setupAutoSave();
    
    // Load data from server on page load
    loadAllData();
    
    // Set up auto-save for form inputs
    setupFormAutoSave();
});

// Add a small server status indicator
function addServerStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'server-status';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.width = '10px';
    indicator.style.height = '10px';
    indicator.style.borderRadius = '50%';
    indicator.style.background = '#999';
    indicator.style.opacity = '0.5';
    
    document.body.appendChild(indicator);
    
    // Check server status
    checkServerAvailability().then(available => {
        if (available) {
            indicator.style.background = '#4CAF50'; // Green for available
            indicator.title = 'Server connected';
        } else {
            indicator.style.background = '#F44336'; // Red for unavailable
            indicator.title = 'Server disconnected';
        }
    });
}

// Set up auto-save for form inputs
function setupFormAutoSave() {
    // Diary inputs
    const diaryInputs = ['diaryTitle', 'diaryContent', 'diaryMood'];
    diaryInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', debounce(() => {
                // The diary.js will save to localStorage, which triggers our auto-save
                console.log('Diary input changed, will auto-save soon');
            }, 1000));
        }
    });
    
    // Thoughts inputs
    const thoughtInput = document.querySelector('.thought-input');
    if (thoughtInput) {
        thoughtInput.addEventListener('input', debounce(() => {
            console.log('Thought input changed, will auto-save soon');
        }, 1000));
    }
    
    // Dreams inputs
    const dreamInputs = document.querySelectorAll('.dream-title-input, .dream-input');
    dreamInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            console.log('Dream input changed, will auto-save soon');
        }, 1000));
    });
}

// Debounce helper function
function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}