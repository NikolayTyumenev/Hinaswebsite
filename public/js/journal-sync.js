// Data export/import system for Hina's Journal on Neocities
document.addEventListener('DOMContentLoaded', function() {
    // Add export/import buttons when logged in
    if (isUserLoggedIn()) {
        addDataManagementUI();
    }
    
    // Check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('hinaJournalLogin') === 'true' || 
               sessionStorage.getItem('hinaJournalLogin') === 'true';
    }
    
    // Add data management UI
    function addDataManagementUI() {
        // Create container for the buttons
        const container = document.createElement('div');
        container.className = 'data-management';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.zIndex = '999';
        
        // Create export button
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '💾 Export Data';
        exportBtn.className = 'data-btn export-btn';
        exportBtn.addEventListener('click', exportAllData);
        styleButton(exportBtn);
        
        // Create import button
        const importBtn = document.createElement('button');
        importBtn.textContent = '📂 Import Data';
        importBtn.className = 'data-btn import-btn';
        importBtn.addEventListener('click', importData);
        styleButton(importBtn);
        
        // Add buttons to container
        container.appendChild(exportBtn);
        container.appendChild(importBtn);
        
        // Add container to body
        document.body.appendChild(container);
    }
    
    // Apply styles to buttons
    function styleButton(button) {
        Object.assign(button.style, {
            backgroundColor: '#8B8FD4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 15px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
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
        dataTypes.forEach(dataType => {
            const data = localStorage.getItem(dataType);
            if (data) {
                try {
                    exportData[dataType] = JSON.parse(data);
                } catch (e) {
                    console.error(`Error parsing ${dataType}:`, e);
                    exportData[dataType] = null;
                }
            }
        });
        
        // Add export metadata
        exportData.metadata = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            device: navigator.userAgent
        };
        
        // Create download
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        
        // Format date for filename
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `hina-journal-data-${dateStr}.json`;
        downloadLink.style.display = 'none';
        
        // Add to body, click, and remove
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(dataUrl);
        }, 100);
        
        // Show notification
        showNotification('Data exported successfully!');
    }
    
    // Import data from file
    function importData() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        // Add to body
        document.body.appendChild(fileInput);
        
        // Listen for file selection
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importData = JSON.parse(event.target.result);
                        processImportData(importData);
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
        
        // Trigger file selection
        fileInput.click();
        
        // Remove from DOM after selection
        setTimeout(() => {
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        }, 60000); // Remove after 1 minute if no selection
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
        const confirmMessage = 'This will replace your current journal data with the imported data. Continue?';
        if (!confirm(confirmMessage)) {
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
            bottom: '80px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '5px',
            fontSize: '14px',
            zIndex: '2000',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            maxWidth: '300px'
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
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});