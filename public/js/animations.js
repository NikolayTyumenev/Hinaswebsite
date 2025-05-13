// General animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random delay to floating animation
        element.style.animationDelay = `${index * 0.5}s`;
        
        // Add random movement pattern
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000);
    });

    // Cat animations
    const cats = document.querySelectorAll('.cat, .gallery-cat, .thinking-cat, .dreaming-cat, .sleeping-cat');
    
    cats.forEach(cat => {
        // Add random blink animation
        setInterval(() => {
            if (Math.random() > 0.8) {
                cat.style.transition = 'transform 0.2s ease';
                cat.style.transform = 'scaleY(0.8)';
                setTimeout(() => {
                    cat.style.transform = 'scaleY(1)';
                }, 200);
            }
        }, 3000);
    });

    // Yarn decoration animations
    const yarnDecorations = document.querySelectorAll('.yarn-decoration, .yarn-line, .connecting-yarn');
    
    yarnDecorations.forEach(yarn => {
        yarn.addEventListener('mouseenter', function() {
            this.style.transform = `${this.style.transform || ''} scale(1.1)`;
        });
        
        yarn.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.1)', '');
        });
    });

    // Page transition animation
    const pageContent = document.querySelector('.journal-content');
    pageContent.style.opacity = '0';
    pageContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        pageContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        pageContent.style.opacity = '1';
        pageContent.style.transform = 'translateY(0)';
    }, 100);

    // Parallax effect for background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        const floatingYarn = document.querySelectorAll('.floating-yarn-ball');
        floatingYarn.forEach(yarn => {
            yarn.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
        
        const floatingBookmarks = document.querySelectorAll('.floating-bookmark');
        floatingBookmarks.forEach(bookmark => {
            bookmark.style.transform = `translateY(${scrolled * -0.1}px)`;
        });
    });

    // Interactive pen decoration
    const pen = document.querySelector('.pen-decoration');
    if (pen) {
        let isWriting = false;
        pen.addEventListener('click', function() {
            if (!isWriting) {
                isWriting = true;
                this.style.transform = 'rotate(-30deg) translateY(-10px)';
                
                // Create ink effect
                const ink = document.createElement('div');
                ink.style.position = 'absolute';
                ink.style.width = '5px';
                ink.style.height = '5px';
                ink.style.background = 'var(--periwinkle)';
                ink.style.borderRadius = '50%';
                ink.style.bottom = '10px';
                ink.style.right = '20px';
                ink.style.opacity = '0';
                document.querySelector('.notebook-page').appendChild(ink);
                
                setTimeout(() => {
                    ink.style.transition = 'opacity 0.3s ease';
                    ink.style.opacity = '1';
                }, 100);
                
                setTimeout(() => {
                    ink.style.opacity = '0';
                    setTimeout(() => ink.remove(), 300);
                    this.style.transform = 'rotate(-30deg)';
                    isWriting = false;
                }, 1000);
            }
        });
    }

    // Add shimmer effect to yarn balls
    const yarnBalls = document.querySelectorAll('.yarn-ball, .floating-yarn-ball');
    yarnBalls.forEach(ball => {
        setInterval(() => {
            if (Math.random() > 0.9) {
                ball.style.boxShadow = '0 0 20px rgba(255, 214, 232, 0.6)';
                setTimeout(() => {
                    ball.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }, 500);
            }
        }, 4000);
    });

    // Create random yarn strands on page load
    function createYarnStrand() {
        const strand = document.createElement('div');
        strand.classList.add('yarn-animation');
        strand.style.left = `${Math.random() * window.innerWidth}px`;
        strand.style.background = Math.random() > 0.5 ? 'var(--baby-pink)' : 'var(--light-yellow)';
        document.body.appendChild(strand);
        
        setTimeout(() => {
            strand.remove();
        }, 1000);
    }

    // Create initial yarn strands
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createYarnStrand(), i * 200);
    }
});