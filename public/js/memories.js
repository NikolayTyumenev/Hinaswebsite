// Memories page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Memory timeline animation
    const memoryCards = document.querySelectorAll('.memory-card');
    
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    memoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.2}s`;
        
        observer.observe(card);
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            const bookmark = this.querySelector('.memory-bookmark');
            if (bookmark) {
                bookmark.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            const bookmark = this.querySelector('.memory-bookmark');
            if (bookmark) {
                bookmark.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Timeline yarn animation
    const timelineYarn = document.querySelector('.timeline-yarn');
    if (timelineYarn) {
        window.addEventListener('scroll', () => {
            const scrollPercentage = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
            timelineYarn.style.background = `linear-gradient(to bottom, 
                var(--baby-pink) ${scrollPercentage * 100}%, 
                var(--light-yellow) ${scrollPercentage * 100 + 33}%, 
                var(--periwinkle) ${scrollPercentage * 100 + 66}%)`;
        });
    }
    
    // Scrapbook items interaction
    const scrapbookItems = document.querySelectorAll('.scrapbook-item');
    scrapbookItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInScale 0.5s ease forwards';
        item.style.opacity = '0';
        
        item.addEventListener('click', function() {
            // Create pop effect
            this.style.animation = 'itemPop 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
            
            // Show details
            const icon = this.querySelector('.item-icon');
            const description = this.querySelector('p');
            
            if (icon && description) {
                const detail = document.createElement('div');
                detail.classList.add('memory-detail');
                detail.innerHTML = `
                    <div class="detail-content">
                        <div class="detail-icon">${icon.outerHTML}</div>
                        <p>${description.textContent}</p>
                        <button class="close-detail">Close</button>
                    </div>
                `;
                detail.style.position = 'fixed';
                detail.style.top = '50%';
                detail.style.left = '50%';
                detail.style.transform = 'translate(-50%, -50%) scale(0)';
                detail.style.background = 'var(--white)';
                detail.style.padding = '30px';
                detail.style.borderRadius = '15px';
                detail.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                detail.style.zIndex = '2000';
                detail.style.transition = 'transform 0.3s ease';
                
                document.body.appendChild(detail);
                
                setTimeout(() => {
                    detail.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);
                
                detail.querySelector('.close-detail').addEventListener('click', () => {
                    detail.style.transform = 'translate(-50%, -50%) scale(0)';
                    setTimeout(() => detail.remove(), 300);
                });
            }
        });
    });
    
    // Memory jar interaction
    const memoryJar = document.querySelector('.memory-jar');
    if (memoryJar) {
        const jarContainer = memoryJar.querySelector('.jar-container');
        const memoryNotes = jarContainer.querySelectorAll('.memory-note');
        
        // Float notes
        memoryNotes.forEach((note, index) => {
            note.style.animation = `floatNote ${3 + index * 0.5}s ease-in-out infinite`;
            note.style.animationDelay = `${index * 0.3}s`;
        });
        
        // Jar click to add memory
        jarContainer.addEventListener('click', function() {
            const newMemory = prompt('What memory would you like to add to the jar?');
            if (newMemory) {
                // Create new note
                const note = document.createElement('div');
                note.classList.add('memory-note');
                note.textContent = newMemory;
                note.style.position = 'absolute';
                note.style.top = `${20 + Math.random() * 60}%`;
                note.style.left = `${10 + Math.random() * 80}%`;
                note.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
                note.style.animation = 'dropIn 0.5s ease';
                
                const jarBody = this.querySelector('.jar-body');
                jarBody.appendChild(note);
                
                // Save to localStorage
                const savedMemoryNotes = JSON.parse(localStorage.getItem('hinaMemoryJar') || '[]');
                savedMemoryNotes.push(newMemory);
                localStorage.setItem('hinaMemoryJar', JSON.stringify(savedMemoryNotes));
                
                // Add float animation after drop
                setTimeout(() => {
                    note.style.animation = `floatNote ${3 + Math.random() * 2}s ease-in-out infinite`;
                }, 500);
            }
        });
        
        // Load saved memory notes
        const savedMemoryNotes = JSON.parse(localStorage.getItem('hinaMemoryJar') || '[]');
        savedMemoryNotes.forEach((memory, index) => {
            const note = document.createElement('div');
            note.classList.add('memory-note');
            note.textContent = memory;
            note.style.position = 'absolute';
            note.style.top = `${20 + Math.random() * 60}%`;
            note.style.left = `${10 + Math.random() * 80}%`;
            note.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
            note.style.animation = `floatNote ${3 + index * 0.5}s ease-in-out infinite`;
            
            const jarBody = jarContainer.querySelector('.jar-body');
            jarBody.appendChild(note);
        });
    }
    
    // Memory cats interaction
    const memoryCats = document.querySelectorAll('.remembering-cat, .nostalgic-cat');
    memoryCats.forEach(cat => {
        cat.addEventListener('mouseenter', function() {
            this.style.animation = 'catRemember 1s ease';
        });
        
        cat.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // Floating memories drift effect
    const floatingMemories = document.querySelectorAll('.floating-memory');
    floatingMemories.forEach((memory, index) => {
        memory.style.animationDelay = `${index * 2}s`;
        
        // Interactive memories
        memory.addEventListener('click', function() {
            this.style.animation = 'memoryBurst 0.5s ease';
            setTimeout(() => {
                this.style.animation = `driftMemory 10s ease-in-out infinite`;
            }, 500);
        });
    });
});

// Custom animations for memories page
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes itemPop {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes floatNote {
        0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
        50% { transform: translateY(-10px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
    }
    
    @keyframes dropIn {
        from {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
        }
        to {
            transform: translateY(0) rotate(var(--rotation, 0deg));
            opacity: 1;
        }
    }
    
    @keyframes catRemember {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
    }
    
    @keyframes memoryBurst {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);