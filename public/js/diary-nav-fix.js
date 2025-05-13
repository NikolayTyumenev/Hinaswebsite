// Fix for diary navigation
document.addEventListener('DOMContentLoaded', function() {
    // Check login status first
    const isLoggedInLocal = localStorage.getItem('hinaJournalLogin') === 'true';
    const isLoggedInSession = sessionStorage.getItem('hinaJournalLogin') === 'true';
    
    if (isLoggedInLocal || isLoggedInSession) {
        // User is logged in, add diary bookmark
        addDiaryNavigation();
    }
    
    // Add login state change listener
    window.addEventListener('storage', function(event) {
        if (event.key === 'hinaJournalLogin') {
            if (event.newValue === 'true') {
                // User logged in
                addDiaryNavigation();
            } else {
                // User logged out
                removeDiaryNavigation();
            }
        }
    });
    
    // Direct function to add diary navigation
    function addDiaryNavigation() {
        const bookmarkContainer = document.querySelector('.bookmark-container');
        if (!bookmarkContainer) return;
        
        // Remove existing diary bookmark if present
        const existingDiary = bookmarkContainer.querySelector('a[href="diary.html"]');
        if (existingDiary) existingDiary.remove();
        
        // Create new diary bookmark
        const diaryBookmark = document.createElement('a');
        diaryBookmark.href = 'diary.html';
        diaryBookmark.className = 'bookmark baby-pink';
        diaryBookmark.innerHTML = '<span class="bookmark-text">Diary</span>';
        
        // Check if current page is diary
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'diary.html') {
            diaryBookmark.classList.add('current-page');
        }
        
        // Append to bookmark container
        bookmarkContainer.appendChild(diaryBookmark);
        
        console.log('Diary navigation added');
    }
    
    // Remove diary navigation
    function removeDiaryNavigation() {
        const diaryBookmark = document.querySelector('.bookmark-container a[href="diary.html"]');
        if (diaryBookmark) diaryBookmark.remove();
    }
    
    // Add a fallback timer to check again after everything has loaded
    setTimeout(function() {
        const isLoggedInLocal = localStorage.getItem('hinaJournalLogin') === 'true';
        const isLoggedInSession = sessionStorage.getItem('hinaJournalLogin') === 'true';
        
        if ((isLoggedInLocal || isLoggedInSession) && !document.querySelector('a[href="diary.html"]')) {
            console.log('Fallback: Adding diary navigation');
            addDiaryNavigation();
        }
    }, 2000);
});