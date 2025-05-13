// Mobile-friendly import/export solution for Hina's Journal
document.addEventListener('DOMContentLoaded', function() {
    // Only proceed if user is logged in
    if (isUserLoggedIn()) {
        // Create floating action button
        createFloatingButton();
    }
    
    // Check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('hinaJournalLogin') === 'true' || 
               sessionStorage.getItem('hinaJournalLogin') === 'true';
    }
    
    // Create floating action button
    function createFloatingButton() {
        // Create button
        const fab = document.createElement('button');
        fab.className = 'mobile-sync-fab';
        fab.innerHTML = '↕️';
        fab.setAttribute('aria-label', 'Data Import/Export');
        fab.setAttribute('title', 'Import/Export Data');
        
        // Style the button
        Object.assign(fab.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#8B8FD4',
            color: 'white',
            fontSize: '24px',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '1000',
            transition: 'all 0.3s ease'
        });
        
        // Add hover/active effects
        fab.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        fab.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        fab.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        fab.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click event to show menu
        fab.addEventListener('click', function() {
            showSyncMenu();
        });
        
        // Add to body
        document.body.appendChild(fab);
    }
    
    // Show sync menu
    function showSyncMenu() {
        // Create menu overlay
        const overlay = document.createElement('div');
        overlay.className = 'sync-menu-overlay';
        
        // Style overlay
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '2000'
        });
        
        // Create menu content
        const menu = document.createElement('div');
        menu.className = 'sync-menu';
        
        // Style menu
        Object.assign(menu.style, {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '20px',
            width: '90%',
            maxWidth: '350px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        });
        
        // Menu content
        menu.innerHTML = `
            <h2 style="color: #8B8FD4; margin-top: 0; text-align: center; font-family: 'Dancing Script', cursive, sans-serif;">Data Sync</h2>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button id="exportBtn" style="padding: 15px; border: none; background-color: #8B8FD4; color: white; border-radius: 10px; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
                    <span style="font-size: 20px;">💾</span>
                    <span>Export Data</span>
                </button>
                
                <button id="importBtn" style="padding: 15px; border: none; background-color: #B8BBEA; color: white; border-radius: 10px; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
                    <span style="font-size: 20px;">📂</span>
                    <span>Import Data</span>
                </button>
                
                <p style="text-align: center; margin: 15px 0; font-size: 14px; color: #666;">
                    Use export to save your journal data.<br>
                    Use import to restore from a backup.
                </p>
                
                <button id="closeBtn" style="padding: 10px; border: 1px solid #ddd; background-color: white; color: #666; border-radius: 10px; font-size: 16px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        // Add to overlay
        overlay.appendChild(menu);
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        // Add button click events
        document.getElementById('exportBtn').addEventListener('click', function() {
            exportAllData();
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        });
        
        document.getElementById('importBtn').addEventListener('click', function() {
            importData();
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        });
        
        document.getElementById('closeBtn').addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
    }
    
    // Export all data
    function exportAllData() {
        // Data types to export
        const dataTypes = [
            'hinaThoughts',
            'hinaDreams',
            'hinaDiaryEntries',
            'hinaGalleryPhotos',
            'hinaMemoryJar'
        ];
        
        // Collect all data
        const exportData = {};
        let hasData = false;
        
        dataTypes.forEach(dataType => {
            const data = localStorage.getItem(dataType);
            if (data) {
                try {
                    exportData[dataType] = JSON.parse(data);
                    hasData = true;
                } catch (e) {
                    console.error(`Error parsing ${dataType}:`, e);
                    exportData[dataType] = null;
                }
            }
        });
        
        if (!hasData) {
            showNotification('No data to export', 'warning');
            return;
        }
        
        // Add export metadata
        exportData.metadata = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            device: navigator.userAgent
        };
        
        // Create download
        const dataStr = JSON.stringify(exportData);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Format date for filename
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const filename = `hina-journal-${dateStr}.json`;
        
        // Mobile browsers have different approaches for downloads
        // Try the best approach based on the browser
        
        // Method 1: Using download attribute (modern browsers)
        try {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(dataBlob);
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            showNotification('Data export started!');
            return;
        } catch (e) {
            console.log('Method 1 failed:', e);
        }
        
        // Method 2: Using window.open (some mobile browsers)
        try {
            const dataUrl = URL.createObjectURL(dataBlob);
            window.open(dataUrl, '_blank');
            showNotification('Data export ready! Save the file');
            setTimeout(() => URL.revokeObjectURL(dataUrl), 60000);
            return;
        } catch (e) {
            console.log('Method 2 failed:', e);
        }
        
        // Method 3: Data URI (fallback)
        try {
            const reader = new FileReader();
            reader.onload = function() {
                const dataUrl = reader.result;
                const link = document.createElement('a');
                link.href = dataUrl;
                link.target = '_blank';
                link.click();
                showNotification('Data export ready! Save the file');
            };
            reader.readAsDataURL(dataBlob);
            return;
        } catch (e) {
            console.log('Method 3 failed:', e);
        }
        
        // If all else fails
        showNotification('Export failed. Try on desktop browser', 'error');
    }
    
    // Import data
    function importData() {
        // On mobile, we need a different approach
        
        // Create a "dropzone" for file input
        const overlay = document.createElement('div');
        overlay.className = 'import-overlay';
        
        // Style overlay
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '3000'
        });
        
        // Create content
        overlay.innerHTML = `
            <div style="background-color: white; border-radius: 15px; padding: 20px; width: 90%; max-width: 350px; text-align: center;">
                <h3 style="color: #8B8FD4; margin-top: 0;">Import Data</h3>
                
                <p style="margin-bottom: 20px;">
                    Select your journal backup file
                </p>
                
                <input type="file" id="fileInput" accept=".json" style="display: none;">
                <label for="fileInput" style="display: block; padding: 15px; background-color: #B8BBEA; color: white; border-radius: 10px; margin-bottom: 15px; cursor: pointer;">
                    Select Backup File
                </label>
                
                <button id="cancelImport" style="padding: 10px; border: 1px solid #ddd; background-color: white; color: #666; border-radius: 10px; width: 100%; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Set up cancel button
        document.getElementById('cancelImport').addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        // Set up file input
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importData = JSON.parse(event.target.result);
                        processImportData(importData);
                        document.body.removeChild(overlay);
                    } catch (err) {
                        console.error('Error parsing import file:', err);
                        showNotification('Error: Invalid file format', 'error');
                    }
                };
                
                reader.onerror = function() {
                    showNotification('Error reading file', 'error');
                };
                
                reader.readAsText(file);
            }
        });
    }
    
    // Process imported data
    function processImportData(importData) {
        if (!importData || typeof importData !== 'object') {
            showNotification('Error: Invalid data format', 'error');
            return;
        }
        
        // Check for metadata
        if (!importData.metadata) {
            showNotification('Warning: This doesn\'t look like a Hina\'s Journal backup file', 'warning');
        }
        
        // Confirm before overwriting
        const confirmImport = confirm('This will replace your current journal data with the imported data. Continue?');
        if (!confirmImport) {
            return;
        }
        
        // Data types to import
        const dataTypes = [
            'hinaThoughts',
            'hinaDreams',
            'hinaDiaryEntries',
            'hinaGalleryPhotos',
            'hinaMemoryJar'
        ];
        
        // Import each data type
        let importCount = 0;
        dataTypes.forEach(dataType => {
            if (importData[dataType]) {
                try {
                    // Store data
                    localStorage.setItem(dataType, JSON.stringify(importData[dataType]));
                    importCount++;
                } catch (e) {
                    console.error(`Error importing ${dataType}:`, e);
                    showNotification(`Error importing ${dataType}`, 'error');
                }
            }
        });
        
        // Show notification and reload page
        if (importCount > 0) {
            showNotification(`Imported ${importCount} data types successfully! Reloading...`);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            showNotification('No data was imported', 'warning');
        }
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: '2000',
            opacity: '0',
            textAlign: 'center',
            maxWidth: '80%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        // Set color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#F44336';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                notification.style.color = 'white';
                break;
        }
        
        // Add to body
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});