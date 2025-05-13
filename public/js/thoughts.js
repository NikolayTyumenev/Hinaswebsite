// Thoughts page functionality
document.addEventListener('DOMContentLoaded', function() {
    const thoughtInput = document.querySelector('.thought-input');
    const addThoughtBtn = document.querySelector('.add-thought-btn');
    const thoughtsSection = document.querySelector('.thoughts-section');
    
    // Load saved thoughts from localStorage
    loadSavedThoughts();
    
    // Add new thought functionality
    if (addThoughtBtn && thoughtInput) {
        addThoughtBtn.addEventListener('click', addNewThought);
        
        // Allow Enter key to submit (Shift+Enter for new line)
        thoughtInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNewThought();
            }
        });
    }
    
    function addNewThought() {
        const thoughtText = thoughtInput.value.trim();
        if (thoughtText) {
            const thought = {
                text: thoughtText,
                date: new Date().toLocaleDateString(),
                id: Date.now()
            };
            
            // Save to localStorage
            saveThought(thought);
            
            // Create and display thought
            displayThought(thought);
            
            // Clear input
            thoughtInput.value = '';
            
            // Animate the addition
            const newEntry = document.querySelector('.thought-entry:last-child');
            newEntry.style.opacity = '0';
            newEntry.style.transform = 'translateY(20px)';
            setTimeout(() => {
                newEntry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                newEntry.style.opacity = '1';
                newEntry.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    function displayThought(thought) {
        const thoughtEntry = document.createElement('div');
        thoughtEntry.classList.add('thought-entry');
        
        const randomColor = ['baby-pink', 'light-yellow', 'periwinkle'][Math.floor(Math.random() * 3)];
        
        thoughtEntry.innerHTML = `
            <div class="entry-date">${thought.date}</div>
            <p>${thought.text}</p>
            <div class="yarn-divider ${randomColor}"></div>
        `;
        
        // Insert after the new thought box
        const newThoughtBox = document.querySelector('.new-thought-box');
        thoughtsSection.insertBefore(thoughtEntry, newThoughtBox);
    }
    
    function saveThought(thought) {
        const savedThoughts = JSON.parse(localStorage.getItem('hinaThoughts') || '[]');
        savedThoughts.unshift(thought); // Add to beginning
        localStorage.setItem('hinaThoughts', JSON.stringify(savedThoughts));
    }
    
    function loadSavedThoughts() {
        const savedThoughts = JSON.parse(localStorage.getItem('hinaThoughts') || '[]');
        savedThoughts.forEach(thought => displayThought(thought));
    }
    
    // Floating thoughts interaction
    const floatingThoughts = document.querySelectorAll('.floating-thought');
    floatingThoughts.forEach(thought => {
        // Make thoughts interactive
        thought.style.cursor = 'pointer';
        
        thought.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'var(--periwinkle)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 1s ease-out forwards';
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
            
            // Bounce animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'bounce 0.5s ease';
            }, 10);
        });
    });
    
    // Thinking cats interaction
    const thinkingCat = document.querySelector('.thinking-cat');
    const dreamingCat = document.querySelector('.dreaming-cat');
    
    if (thinkingCat) {
        thoughtInput.addEventListener('focus', function() {
            thinkingCat.style.animation = 'catThink 2s ease-in-out infinite';
        });
        
        thoughtInput.addEventListener('blur', function() {
            thinkingCat.style.animation = '';
        });
    }
    
    if (dreamingCat && thoughtInput) {
        thoughtInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                dreamingCat.style.animation = 'catDream 2s ease-in-out infinite';
            } else {
                dreamingCat.style.animation = '';
            }
        });
    }
    
    // Page yarn decorations animation
    const yarnDecorations = document.querySelectorAll('.curly-yarn');
    yarnDecorations.forEach((yarn, index) => {
        yarn.style.animation = `curlYarn ${3 + index}s ease-in-out infinite`;
        yarn.style.animationDelay = `${index * 0.5}s`;
    });
});

// Custom animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            width: 20px;
            height: 20px;
            opacity: 0.6;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes catThink {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.1); }
    }
    
    @keyframes catDream {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-5px) rotate(-5deg); }
        75% { transform: translateX(5px) rotate(5deg); }
    }
    
    @keyframes curlYarn {
        0%, 100% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(10deg) scale(1.1); }
    }
`;
document.head.appendChild(style);