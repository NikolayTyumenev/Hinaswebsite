// Navigation functionality for yarn ball menu
document.addEventListener('DOMContentLoaded', function() {
    const yarnBall = document.getElementById('yarnBall');
    const mainNav = document.getElementById('mainNav');
    const yarnTrail = document.getElementById('yarnTrail');
    let isMenuOpen = false;

    // Only show yarn ball on mobile
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            yarnBall.style.display = 'block';
        } else {
            yarnBall.style.display = 'none';
            mainNav.classList.remove('open');
            yarnTrail.classList.remove('active');
            isMenuOpen = false;
        }
    }

    // Initial check
    checkScreenSize();

    // Check on resize
    window.addEventListener('resize', checkScreenSize);

    // Yarn ball click handler
    yarnBall.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            // Roll the yarn ball
            yarnBall.classList.add('rolling');
            
            // Show yarn trail
            setTimeout(() => {
                yarnTrail.classList.add('active');
            }, 300);

            // Open navigation
            setTimeout(() => {
                mainNav.classList.add('open');
                yarnBall.classList.remove('rolling');
            }, 500);
        } else {
            // Close navigation
            mainNav.classList.remove('open');
            
            // Hide yarn trail
            setTimeout(() => {
                yarnTrail.classList.remove('active');
            }, 300);

            // Roll yarn ball back
            yarnBall.classList.add('rolling');
            setTimeout(() => {
                yarnBall.classList.remove('rolling');
            }, 1000);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && 
            !yarnBall.contains(event.target) && 
            !mainNav.contains(event.target)) {
            yarnBall.click();
        }
    });

    // Add hover effects to bookmarks
    const bookmarks = document.querySelectorAll('.bookmark');
    bookmarks.forEach(bookmark => {
        bookmark.addEventListener('mouseenter', function() {
            const catSilhouette = this.querySelector('.cat-silhouette');
            if (catSilhouette) {
                catSilhouette.style.transform = 'translateY(-5px)';
            }
        });

        bookmark.addEventListener('mouseleave', function() {
            const catSilhouette = this.querySelector('.cat-silhouette');
            if (catSilhouette) {
                catSilhouette.style.transform = 'translateY(0)';
            }
        });
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active page indicator based on current page
    const currentPage = window.location.pathname.split('/').pop();
    bookmarks.forEach(bookmark => {
        const href = bookmark.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            bookmark.classList.add('current-page');
        }
    });
    
    // Update navigation to include diary page only for logged-in users
    // NOTE: This is handled by auth.js, but included here as a fallback
    // to ensure the diary bookmark is displayed correctly
    const bookmarkContainer = document.querySelector('.bookmark-container');
    if (bookmarkContainer) {
        // Check if user is logged in before showing diary
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
            if (!bookmarkContainer.querySelector('[href="diary.html"]')) {
                const diaryBookmark = document.createElement('a');
                diaryBookmark.href = 'diary.html';
                diaryBookmark.className = 'bookmark baby-pink';
                diaryBookmark.innerHTML = '<span class="bookmark-text">Diary</span>';
                bookmarkContainer.appendChild(diaryBookmark);
                
                // If current page is diary, mark it as active
                const currentPage = window.location.pathname.split('/').pop();
                if (currentPage === 'diary.html') {
                    diaryBookmark.classList.add('current-page');
                }
            }
        } else {
            // Remove diary bookmark if not logged in
            const diaryBookmark = bookmarkContainer.querySelector('[href="diary.html"]');
            if (diaryBookmark) {
                diaryBookmark.remove();
            }
        }
    }
});