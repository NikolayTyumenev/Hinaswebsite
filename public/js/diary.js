// Diary page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedInLocal = localStorage.getItem('hinaJournalLogin') === 'true';
    const isLoggedInSession = sessionStorage.getItem('hinaJournalLogin') === 'true';
    
    if (!isLoggedInLocal && !isLoggedInSession) {
        // Redirect to home page if not logged in
        window.location.href = 'index.html';
        return;
    }
    
    // Make sure navigation shows diary link
    ensureDiaryInNavigation();
    
    const diaryEntries = document.getElementById('diaryEntries');
    const addDiaryBtn = document.getElementById('addDiaryEntry');
    const diaryDate = document.getElementById('diaryDate');
    const diaryTitle = document.getElementById('diaryTitle');
    const diaryContent = document.getElementById('diaryContent');
    const diaryMood = document.getElementById('diaryMood');
    
    // Set today's date as default
    if (diaryDate) {
        diaryDate.value = new Date().toISOString().split('T')[0];
    }
    
    // Load existing diary entries
    loadDiaryEntries();
    
    // Add new diary entry
    if (addDiaryBtn) {
        addDiaryBtn.addEventListener('click', function() {
            if (isLoggedIn && diaryTitle.value.trim() && diaryContent.value.trim()) {
                const entry = {
                    id: Date.now(),
                    date: diaryDate.value,
                    title: diaryTitle.value,
                    content: diaryContent.value,
                    mood: diaryMood.value,
                    timestamp: new Date().toISOString()
                };
                
                // Save to localStorage
                saveDiaryEntry(entry);
                
                // Display the entry
                displayDiaryEntry(entry);
                
                // Clear form
                diaryTitle.value = '';
                diaryContent.value = '';
                diaryMood.value = 'happy';
                
                // Animate addition
                const newEntry = diaryEntries.firstChild;
                if (newEntry) {
                    newEntry.style.opacity = '0';
                    newEntry.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        newEntry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        newEntry.style.opacity = '1';
                        newEntry.style.transform = 'translateY(0)';
                    }, 10);
                }
            }
        });
    }
    
    function saveDiaryEntry(entry) {
        const savedEntries = JSON.parse(localStorage.getItem('hinaDiaryEntries') || '[]');
        savedEntries.unshift(entry); // Add to beginning
        localStorage.setItem('hinaDiaryEntries', JSON.stringify(savedEntries));
    }
    
    function loadDiaryEntries() {
        const savedEntries = JSON.parse(localStorage.getItem('hinaDiaryEntries') || '[]');
        savedEntries.forEach(entry => displayDiaryEntry(entry));
    }
    
    function displayDiaryEntry(entry) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('diary-entry');
        entryElement.dataset.id = entry.id;
        
        const moodEmoji = getMoodEmoji(entry.mood);
        
        entryElement.innerHTML = `
            <div class="diary-entry-header">
                <h3>${entry.title}</h3>
                <div class="diary-entry-meta">
                    <span class="diary-entry-date">${formatDate(entry.date)}</span>
                    <span class="diary-entry-mood">${moodEmoji}</span>
                </div>
            </div>
            <div class="diary-entry-content">
                <p>${entry.content}</p>
            </div>
            ${isLoggedIn ? '<button class="edit-diary-btn" onclick="editDiaryEntry(' + entry.id + ')">✏️</button>' : ''}
            ${isLoggedIn ? '<button class="delete-diary-btn" onclick="deleteDiaryEntry(' + entry.id + ')">🗑️</button>' : ''}
            <div class="diary-entry-decoration">
                <div class="diary-yarn-accent"></div>
            </div>
        `;
        
        diaryEntries.insertBefore(entryElement, diaryEntries.firstChild);
    }
    
    function getMoodEmoji(mood) {
        const moods = {
            'happy': '😊',
            'peaceful': '😌',
            'excited': '🤗',
            'thoughtful': '🤔',
            'grateful': '🙏',
            'tired': '😴',
            'anxious': '😟',
            'sad': '😢'
        };
        return moods[mood] || '😊';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Add diary decorations animation
    const diaryYarns = document.querySelectorAll('.diary-yarn');
    diaryYarns.forEach((yarn, index) => {
        yarn.style.animation = `floatYarn ${3 + index}s ease-in-out infinite`;
        yarn.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Diary cat animation
    const diaryCat = document.querySelector('.diary-cat');
    if (diaryCat) {
        diaryCat.addEventListener('click', function() {
            this.style.animation = 'catWrite 1s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    }
});

// Global functions for editing and deleting
function editDiaryEntry(id) {
    if (!isLoggedIn) return;
    
    const entryElement = document.querySelector(`[data-id="${id}"]`);
    const contentElement = entryElement.querySelector('.diary-entry-content p');
    const currentContent = contentElement.textContent;
    
    const textarea = document.createElement('textarea');
    textarea.value = currentContent;
    textarea.classList.add('edit-diary-textarea');
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-diary-edit');
    
    contentElement.style.display = 'none';
    contentElement.parentNode.appendChild(textarea);
    contentElement.parentNode.appendChild(saveBtn);
    
    saveBtn.addEventListener('click', function() {
        const newContent = textarea.value;
        contentElement.textContent = newContent;
        contentElement.style.display = 'block';
        textarea.remove();
        saveBtn.remove();
        
        // Update in localStorage
        const savedEntries = JSON.parse(localStorage.getItem('hinaDiaryEntries') || '[]');
        const entry = savedEntries.find(e => e.id === id);
        if (entry) {
            entry.content = newContent;
            localStorage.setItem('hinaDiaryEntries', JSON.stringify(savedEntries));
        }
    });
}

function deleteDiaryEntry(id) {
    if (!isLoggedIn) return;
    
    if (confirm('Are you sure you want to delete this diary entry?')) {
        const entryElement = document.querySelector(`[data-id="${id}"]`);
        
        // Animate removal
        entryElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        entryElement.style.opacity = '0';
        entryElement.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            entryElement.remove();
        }, 500);
        
        // Remove from localStorage
        const savedEntries = JSON.parse(localStorage.getItem('hinaDiaryEntries') || '[]');
        const updatedEntries = savedEntries.filter(e => e.id !== id);
        localStorage.setItem('hinaDiaryEntries', JSON.stringify(updatedEntries));
    }
}

// Additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatYarn {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(10deg); }
    }
    
    @keyframes catWrite {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Helper function to ensure diary is in navigation
function ensureDiaryInNavigation() {
    const bookmarkContainer = document.querySelector('.bookmark-container');
    if (!bookmarkContainer) return;
    
    // Check if diary link exists
    const diaryLink = bookmarkContainer.querySelector('a[href="diary.html"]');
    if (!diaryLink) {
        // Create diary link
        const diaryBookmark = document.createElement('a');
        diaryBookmark.href = 'diary.html';
        diaryBookmark.className = 'bookmark baby-pink current-page';
        diaryBookmark.innerHTML = '<span class="bookmark-text">Diary</span>';
        bookmarkContainer.appendChild(diaryBookmark);
        console.log('Added diary to navigation');
    } else {
        // Ensure it's marked as current page
        diaryLink.classList.add('current-page');
    }
}