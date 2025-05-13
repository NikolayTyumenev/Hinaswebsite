// Dreams page functionality
document.addEventListener('DOMContentLoaded', function() {
    const dreamTitleInput = document.querySelector('.dream-title-input');
    const dreamInput = document.querySelector('.dream-input');
    const addDreamBtn = document.querySelector('.add-dream-btn');
    const dreamCloudContainer = document.querySelector('.dream-cloud-container');
    
    // Load saved dreams
    loadSavedDreams();
    
    // Add new dream functionality
    if (addDreamBtn && dreamTitleInput && dreamInput) {
        addDreamBtn.addEventListener('click', addNewDream);
    }
    
    function addNewDream() {
        const dreamTitle = dreamTitleInput.value.trim();
        const dreamText = dreamInput.value.trim();
        
        if (dreamTitle && dreamText) {
            const dream = {
                title: dreamTitle,
                text: dreamText,
                date: new Date().toLocaleDateString(),
                id: Date.now()
            };
            
            // Save to localStorage
            saveDream(dream);
            
            // Display dream
            displayDream(dream);
            
            // Clear inputs
            dreamTitleInput.value = '';
            dreamInput.value = '';
            
            // Animate the addition
            const newCloud = document.querySelector('.dream-cloud:last-child');
            animateDreamCloud(newCloud);
        }
    }
    
    function displayDream(dream) {
        const dreamCloud = document.createElement('div');
        dreamCloud.classList.add('dream-cloud');
        
        dreamCloud.innerHTML = `
            <h3>${dream.title}</h3>
            <p>${dream.text}</p>
            <small style="display: block; text-align: right; color: var(--periwinkle); font-size: 0.8rem; margin-top: 10px;">${dream.date}</small>
        `;
        
        dreamCloudContainer.appendChild(dreamCloud);
    }
    
    function saveDream(dream) {
        const savedDreams = JSON.parse(localStorage.getItem('hinaDreams') || '[]');
        savedDreams.push(dream);
        localStorage.setItem('hinaDreams', JSON.stringify(savedDreams));
    }
    
    function loadSavedDreams() {
        const savedDreams = JSON.parse(localStorage.getItem('hinaDreams') || '[]');
        savedDreams.forEach(dream => displayDream(dream));
    }
    
    function animateDreamCloud(cloud) {
        cloud.style.opacity = '0';
        cloud.style.transform = 'scale(0.5) translateY(50px)';
        
        setTimeout(() => {
            cloud.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            cloud.style.opacity = '1';
            cloud.style.transform = 'scale(1) translateY(0)';
        }, 10);
    }
    
    // Dream catcher interaction
    const dreamCatcher = document.querySelector('.dream-catcher');
    if (dreamCatcher) {
        dreamCatcher.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.transform = `rotateX(${deltaY * 10}deg) rotateY(${deltaX * 10}deg)`;
        });
        
        dreamCatcher.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateX(0) rotateY(0)';
        });
        
        // Add click effect
        dreamCatcher.addEventListener('click', function() {
            const feathers = this.querySelectorAll('.feather');
            feathers.forEach((feather, index) => {
                feather.style.animation = 'none';
                setTimeout(() => {
                    feather.style.animation = `swayFeather ${2 + index * 0.5}s ease-in-out infinite`;
                }, 10);
            });
            
            // Create magical sparkle effect
            for (let i = 0; i < 10; i++) {
                createSparkle(this);
            }
        });
    }
    
    function createSparkle(parent) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'var(--periwinkle)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.boxShadow = '0 0 4px var(--periwinkle)';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        parent.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Sleeping cats dream bubbles
    const sleepingCats = document.querySelectorAll('.sleeping-cat');
    sleepingCats.forEach(cat => {
        const bubble = cat.querySelector('.dream-bubble');
        if (bubble) {
            // Periodic bubble pop
            setInterval(() => {
                bubble.style.animation = 'bubblePop 0.5s ease';
                setTimeout(() => {
                    bubble.style.animation = 'floatBubble 3s ease-in-out infinite';
                }, 500);
            }, 5000 + Math.random() * 3000);
        }
        
        // Cat breathing animation
        cat.style.animation = 'catBreathe 3s ease-in-out infinite';
        cat.style.animationDelay = `${Math.random() * 2}s`;
    });
    
    // Stars twinkling
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.style.animationDelay = `${index * 0.3}s`;
        
        // Random shooting star effect
        if (Math.random() > 0.7) {
            setInterval(() => {
                if (Math.random() > 0.9) {
                    star.style.animation = 'shootingStar 1s ease-out';
                    setTimeout(() => {
                        star.style.animation = 'twinkle 2s ease-in-out infinite';
                    }, 1000);
                }
            }, 10000);
        }
    });
    
    // Dream clouds hover effect
    const dreamClouds = document.querySelectorAll('.dream-cloud');
    dreamClouds.forEach(cloud => {
        cloud.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 12px 24px rgba(139, 143, 212, 0.3)';
        });
        
        cloud.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 8px 16px rgba(139, 143, 212, 0.2)';
        });
    });
});

// Additional animations for dreams page
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 40 - 20}px, -50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes bubblePop {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.5; }
        100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes shootingStar {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(100px, 100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);