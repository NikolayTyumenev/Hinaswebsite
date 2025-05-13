// Date functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    function updateDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    // Update date immediately
    updateDate();
    
    // Update date every minute
    setInterval(updateDate, 60000);

    // Add seasonal decorations based on current month
    const month = new Date().getMonth();
    const notebookPage = document.querySelector('.notebook-page');
    
    if (notebookPage) {
        let seasonalElement;
        
        switch(month) {
            case 11: // December
            case 0:  // January
            case 1:  // February
                // Winter decorations
                seasonalElement = document.createElement('div');
                seasonalElement.innerHTML = '❄️';
                seasonalElement.style.position = 'absolute';
                seasonalElement.style.top = '10px';
                seasonalElement.style.right = '10px';
                seasonalElement.style.fontSize = '24px';
                seasonalElement.style.animation = 'float 3s ease-in-out infinite';
                break;
                
            case 2:  // March
            case 3:  // April
            case 4:  // May
                // Spring decorations
                seasonalElement = document.createElement('div');
                seasonalElement.innerHTML = '🌸';
                seasonalElement.style.position = 'absolute';
                seasonalElement.style.top = '10px';
                seasonalElement.style.right = '10px';
                seasonalElement.style.fontSize = '24px';
                seasonalElement.style.animation = 'float 3s ease-in-out infinite';
                break;
                
            case 5:  // June
            case 6:  // July
            case 7:  // August
                // Summer decorations
                seasonalElement = document.createElement('div');
                seasonalElement.innerHTML = '☀️';
                seasonalElement.style.position = 'absolute';
                seasonalElement.style.top = '10px';
                seasonalElement.style.right = '10px';
                seasonalElement.style.fontSize = '24px';
                seasonalElement.style.animation = 'float 3s ease-in-out infinite';
                break;
                
            case 8:  // September
            case 9:  // October
            case 10: // November
                // Autumn decorations
                seasonalElement = document.createElement('div');
                seasonalElement.innerHTML = '🍂';
                seasonalElement.style.position = 'absolute';
                seasonalElement.style.top = '10px';
                seasonalElement.style.right = '10px';
                seasonalElement.style.fontSize = '24px';
                seasonalElement.style.animation = 'float 3s ease-in-out infinite';
                break;
        }
        
        if (seasonalElement) {
            notebookPage.appendChild(seasonalElement);
        }
    }

    // Add time-based greetings
    function updateGreeting() {
        const hour = new Date().getHours();
        const headerElement = document.querySelector('.page-header');
        
        if (headerElement) {
            let greeting;
            if (hour < 12) {
                greeting = 'Good Morning';
            } else if (hour < 17) {
                greeting = 'Good Afternoon';
            } else if (hour < 21) {
                greeting = 'Good Evening';
            } else {
                greeting = 'Good Night';
            }
            
            // Add greeting if it doesn't exist
            let greetingElement = headerElement.querySelector('.greeting');
            if (!greetingElement) {
                greetingElement = document.createElement('div');
                greetingElement.classList.add('greeting');
                greetingElement.style.fontSize = '1.2rem';
                greetingElement.style.color = 'var(--periwinkle)';
                greetingElement.style.marginBottom = '10px';
                headerElement.insertBefore(greetingElement, headerElement.firstChild);
            }
            
            greetingElement.textContent = greeting;
        }
    }

    // Update greeting immediately
    updateGreeting();
    
    // Update greeting every hour
    setInterval(updateGreeting, 3600000);
});