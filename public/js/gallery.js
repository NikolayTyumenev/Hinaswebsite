// Gallery page interactions
document.addEventListener('DOMContentLoaded', function() {
    const photoGallery = document.getElementById('photoGallery');
    const addPhotoContainer = document.getElementById('addPhotoContainer');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    let photoFrames = document.querySelectorAll('.photo-frame');
    
    // Frame colors for cycling through
    const frameColors = ['periwinkle-frame', 'baby-blue-frame', 'baby-pink-frame', 'light-yellow-frame'];
    const yarnColors = ['pink', 'yellow', 'periwinkle', 'baby-blue'];
    
    // Show add photo button if logged in
    if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
        addPhotoContainer.style.display = 'block';
    }
    
    // Add new photo frame
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function() {
            createNewPhotoFrame();
        });
    }
    
    // Create a new photo frame
    function createNewPhotoFrame() {
        const frameCount = photoGallery.children.length;
        const frameColorIndex = frameCount % frameColors.length;
        const yarnColorIndex = frameCount % yarnColors.length;
        
        const newFrame = document.createElement('div');
        newFrame.className = `photo-frame ${frameColors[frameColorIndex]}`;
        newFrame.innerHTML = `
            <div class="photo-placeholder" style="position: relative;">
                <div class="photo-date">${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                <div class="photo-caption">Click to add photo</div>
            </div>
            <div class="frame-decoration">
                <div class="yarn-accent ${yarnColors[yarnColorIndex]}"></div>
            </div>
        `;
        
        photoGallery.appendChild(newFrame);
        
        // Re-initialize photo frames
        setupPhotoFrame(newFrame);
        
        // Animate the addition
        newFrame.style.opacity = '0';
        newFrame.style.transform = 'scale(0.8)';
        setTimeout(() => {
            newFrame.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            newFrame.style.opacity = '1';
            newFrame.style.transform = 'scale(1)';
        }, 10);
        
        // Scroll to the new frame
        setTimeout(() => {
            newFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    }
    
    // Setup photo frame functionality
    function setupPhotoFrame(frame) {
        // Add hover effects
        frame.addEventListener('mouseenter', function() {
            const yarnAccent = this.querySelector('.yarn-accent');
            if (yarnAccent) {
                yarnAccent.style.transform = 'scale(1.2) rotate(180deg)';
                yarnAccent.style.transition = 'transform 0.5s ease';
            }
        });
        
        frame.addEventListener('mouseleave', function() {
            const yarnAccent = this.querySelector('.yarn-accent');
            if (yarnAccent) {
                yarnAccent.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Setup placeholder functionality
        const placeholder = frame.querySelector('.photo-placeholder');
        if (placeholder) {
            setupPlaceholder(placeholder, frame);
        }
        
        // Add click to view larger functionality
        frame.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                createLightbox(this);
            }
        });
        
        // Add edit caption functionality if logged in
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
            addEditCaptionButton(frame);
        }
    }
    
    // Setup placeholder functionality
    function setupPlaceholder(placeholder, frame) {
        // Add hover effect for logged-in users
        placeholder.addEventListener('mouseenter', function() {
            if (typeof isLoggedIn !== 'undefined' && isLoggedIn && !this.querySelector('img')) {
                if (!this.querySelector('.upload-hint')) {
                    const hint = document.createElement('div');
                    hint.className = 'upload-hint';
                    hint.style.position = 'absolute';
                    hint.style.bottom = '10px';
                    hint.style.left = '50%';
                    hint.style.transform = 'translateX(-50%)';
                    hint.style.color = 'var(--periwinkle)';
                    hint.style.fontSize = '0.9rem';
                    hint.textContent = 'Click to add photo';
                    this.appendChild(hint);
                }
            }
        });
        
        placeholder.addEventListener('mouseleave', function() {
            const hint = this.querySelector('.upload-hint');
            if (hint) hint.remove();
        });
        
        // Add click handler for upload functionality
        placeholder.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (typeof isLoggedIn === 'undefined' || !isLoggedIn) return;
            if (this.querySelector('img')) return; // Already has an image
            
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Replace placeholder with actual image
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '250px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '5px';
                        
                        // Get frame info
                        const frameId = Date.now(); // Unique ID for new frames
                        const dateText = placeholder.querySelector('.photo-date').textContent;
                        const captionText = placeholder.querySelector('.photo-caption').textContent;
                        
                        // Save to localStorage
                        const savedPhotos = JSON.parse(localStorage.getItem('hinaGalleryPhotos') || '{}');
                        savedPhotos[frameId] = {
                            src: e.target.result,
                            date: dateText,
                            caption: captionText
                        };
                        localStorage.setItem('hinaGalleryPhotos', JSON.stringify(savedPhotos));
                        
                        // Replace placeholder with image
                        placeholder.innerHTML = '';
                        placeholder.appendChild(img);
                        placeholder.dataset.frameId = frameId;
                        
                        // Add back the date and caption
                        const dateDiv = document.createElement('div');
                        dateDiv.className = 'photo-date';
                        dateDiv.textContent = dateText;
                        dateDiv.style.position = 'absolute';
                        dateDiv.style.top = '10px';
                        dateDiv.style.left = '10px';
                        dateDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                        dateDiv.style.padding = '5px 10px';
                        dateDiv.style.borderRadius = '5px';
                        placeholder.appendChild(dateDiv);
                        
                        const captionDiv = document.createElement('div');
                        captionDiv.className = 'photo-caption';
                        captionDiv.textContent = captionText;
                        captionDiv.style.position = 'absolute';
                        captionDiv.style.bottom = '10px';
                        captionDiv.style.left = '10px';
                        captionDiv.style.right = '10px';
                        captionDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                        captionDiv.style.padding = '5px 10px';
                        captionDiv.style.borderRadius = '5px';
                        placeholder.appendChild(captionDiv);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Trigger file selection
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        });
    }
    
    // Add edit caption button
    function addEditCaptionButton(frame) {
        const caption = frame.querySelector('.photo-caption');
        if (caption && frame.querySelector('img')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-caption-btn';
            editBtn.innerHTML = '✏️';
            editBtn.style.position = 'absolute';
            editBtn.style.bottom = '10px';
            editBtn.style.right = '10px';
            editBtn.style.background = 'none';
            editBtn.style.border = 'none';
            editBtn.style.cursor = 'pointer';
            editBtn.style.fontSize = '1.2rem';
            editBtn.style.opacity = '0';
            editBtn.style.transition = 'opacity 0.3s ease';
            editBtn.style.zIndex = '10';
            
            frame.appendChild(editBtn);
            
            frame.addEventListener('mouseenter', function() {
                if (this.querySelector('img')) {
                    editBtn.style.opacity = '1';
                }
            });
            
            frame.addEventListener('mouseleave', function() {
                editBtn.style.opacity = '0';
            });
            
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentCaption = caption.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentCaption;
                input.style.width = '100%';
                input.style.padding = '5px';
                input.style.border = '1px solid var(--periwinkle)';
                input.style.borderRadius = '5px';
                
                caption.style.display = 'none';
                caption.parentNode.insertBefore(input, caption);
                input.focus();
                
                const saveEdit = function() {
                    const newCaption = input.value;
                    caption.textContent = newCaption;
                    caption.style.display = 'block';
                    input.remove();
                    
                    // Save to localStorage
                    const frameId = frame.querySelector('.photo-placeholder').dataset.frameId;
                    if (frameId) {
                        const savedPhotos = JSON.parse(localStorage.getItem('hinaGalleryPhotos') || '{}');
                        if (savedPhotos[frameId]) {
                            savedPhotos[frameId].caption = newCaption;
                            localStorage.setItem('hinaGalleryPhotos', JSON.stringify(savedPhotos));
                        }
                    }
                };
                
                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            });
        }
    }
    
    // Create lightbox for viewing photos
    function createLightbox(frame) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.background = 'rgba(0, 0, 0, 0.8)';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.zIndex = '2000';
        lightbox.style.opacity = '0';
        lightbox.style.transition = 'opacity 0.3s ease';
        
        // Create enlarged frame
        const enlargedFrame = frame.cloneNode(true);
        enlargedFrame.style.transform = 'scale(1.5)';
        enlargedFrame.style.transition = 'transform 0.3s ease';
        enlargedFrame.style.cursor = 'default';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '40px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        
        lightbox.appendChild(enlargedFrame);
        lightbox.appendChild(closeButton);
        document.body.appendChild(lightbox);
        
        // Fade in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Close functionality
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        };
        
        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    // Load saved photos on page load
    function loadSavedPhotos() {
        const savedPhotos = JSON.parse(localStorage.getItem('hinaGalleryPhotos') || '{}');
        
        Object.keys(savedPhotos).forEach(frameId => {
            const photo = savedPhotos[frameId];
            
            // Check if this is a new frame that needs to be created
            if (parseInt(frameId) > 6) { // IDs greater than 6 are new frames
                createNewPhotoFrame();
                const newFrame = photoGallery.lastChild;
                const placeholder = newFrame.querySelector('.photo-placeholder');
                
                if (placeholder && photo.src) {
                    const img = document.createElement('img');
                    img.src = photo.src;
                    img.style.width = '100%';
                    img.style.height = '250px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '5px';
                    
                    placeholder.innerHTML = '';
                    placeholder.appendChild(img);
                    placeholder.dataset.frameId = frameId;
                    
                    // Add date and caption
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'photo-date';
                    dateDiv.textContent = photo.date;
                    dateDiv.style.position = 'absolute';
                    dateDiv.style.top = '10px';
                    dateDiv.style.left = '10px';
                    dateDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                    dateDiv.style.padding = '5px 10px';
                    dateDiv.style.borderRadius = '5px';
                    placeholder.appendChild(dateDiv);
                    
                    const captionDiv = document.createElement('div');
                    captionDiv.className = 'photo-caption';
                    captionDiv.textContent = photo.caption;
                    captionDiv.style.position = 'absolute';
                    captionDiv.style.bottom = '10px';
                    captionDiv.style.left = '10px';
                    captionDiv.style.right = '10px';
                    captionDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                    captionDiv.style.padding = '5px 10px';
                    captionDiv.style.borderRadius = '5px';
                    placeholder.appendChild(captionDiv);
                    
                    if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
                        addEditCaptionButton(newFrame);
                    }
                }
            } else {
                // Original frames (first 6)
                const existingFrame = photoFrames[parseInt(frameId)];
                if (existingFrame && photo.src) {
                    const placeholder = existingFrame.querySelector('.photo-placeholder');
                    
                    const img = document.createElement('img');
                    img.src = photo.src;
                    img.style.width = '100%';
                    img.style.height = '250px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '5px';
                    
                    placeholder.innerHTML = '';
                    placeholder.appendChild(img);
                    placeholder.dataset.frameId = frameId;
                    
                    // Add date and caption
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'photo-date';
                    dateDiv.textContent = photo.date;
                    dateDiv.style.position = 'absolute';
                    dateDiv.style.top = '10px';
                    dateDiv.style.left = '10px';
                    dateDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                    dateDiv.style.padding = '5px 10px';
                    dateDiv.style.borderRadius = '5px';
                    placeholder.appendChild(dateDiv);
                    
                    const captionDiv = document.createElement('div');
                    captionDiv.className = 'photo-caption';
                    captionDiv.textContent = photo.caption;
                    captionDiv.style.position = 'absolute';
                    captionDiv.style.bottom = '10px';
                    captionDiv.style.left = '10px';
                    captionDiv.style.right = '10px';
                    captionDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                    captionDiv.style.padding = '5px 10px';
                    captionDiv.style.borderRadius = '5px';
                    placeholder.appendChild(captionDiv);
                    
                    if (typeof isLoggedIn !== 'undefined' && isLoggedIn) {
                        addEditCaptionButton(existingFrame);
                    }
                }
            }
        });
    }
    
    // Initialize existing photo frames
    photoFrames.forEach((frame, index) => {
        setupPhotoFrame(frame);
        // Assign IDs to original frames
        const placeholder = frame.querySelector('.photo-placeholder');
        if (placeholder && !placeholder.dataset.frameId) {
            placeholder.dataset.frameId = index;
        }
    });
    
    // Load photos when page loads
    loadSavedPhotos();
    
    // Gallery cat interactions
    const galleryCats = document.querySelectorAll('.gallery-cat');
    galleryCats.forEach(cat => {
        // Make cats follow mouse slightly
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            const rect = cat.getBoundingClientRect();
            const catCenterX = rect.left + rect.width / 2;
            const catCenterY = rect.top + rect.height / 2;
            
            // Calculate direction to mouse
            const deltaX = e.clientX - catCenterX;
            const deltaY = e.clientY - catCenterY;
            
            // Limit movement
            targetX = Math.max(-10, Math.min(10, deltaX * 0.02));
            targetY = Math.max(-10, Math.min(10, deltaY * 0.02));
        });
        
        // Smooth animation
        function animate() {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            
            cat.style.transform = `translate(${currentX}px, ${currentY}px)`;
            requestAnimationFrame(animate);
        }
        animate();
    });
});