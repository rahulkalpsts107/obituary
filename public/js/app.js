document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Condolence form handling
    const condolenceForm = document.getElementById('condolenceForm');
    if (condolenceForm) {
        condolenceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic client-side validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (message.length < 5) {
                alert('Message must be at least 5 characters long');
                return;
            }
            
            try {
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                
                const formData = {
                    name: name,
                    email: email,
                    message: message
                };

                console.log('Submitting form data:', formData);

                const response = await fetch('/api/condolences/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                console.log('Server response:', result);
                
                if (result.success) {
                    alert('Thank you for your condolence message. You will receive a confirmation email shortly.');
                    this.reset();
                    // Refresh the page to show the new message
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    throw new Error(result.error || 'Failed to submit message');
                }
            } catch (error) {
                console.error('Error submitting message:', error);
                alert('Error submitting message: ' + error.message);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Slideshow functionality
let slideIndex = 0;
let fullscreenIndex = 0;
let totalSlides = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    if (totalSlides > 0) {
        showSlide(slideIndex);
        
        // Auto-advance slideshow every 5 seconds
        setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
});

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const photoCounter = document.getElementById('currentPhotoNum');
    
    if (index >= totalSlides) slideIndex = 0;
    if (index < 0) slideIndex = totalSlides - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }
    
    // Update photo counter
    if (photoCounter) {
        photoCounter.textContent = slideIndex + 1;
    }
    
    // Update active dot (only for visible dots)
    const activeDotIndex = Math.min(slideIndex, dots.length - 1);
    if (dots[activeDotIndex]) {
        dots[activeDotIndex].classList.add('active');
    }
}

function changeSlide(direction) {
    slideIndex += direction;
    showSlide(slideIndex);
}

function currentSlide(index) {
    slideIndex = index - 1;
    showSlide(slideIndex);
}

// Fullscreen functionality
function openFullscreen(imageSrc, index) {
    const modal = document.getElementById('fullscreenModal');
    const img = document.getElementById('fullscreenImg');
    const caption = document.getElementById('fullscreenCaption');
    
    fullscreenIndex = index;
    modal.style.display = 'block';
    img.src = imageSrc;
    
    // Get photo position from the slide
    const slide = document.querySelector(`[data-slide="${index}"]`);
    const slideCaption = slide ? slide.querySelector('.slide-caption p').textContent : `Photo ${index + 1}`;
    caption.textContent = slideCaption;
    
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function fullscreenPrev() {
    const slides = document.querySelectorAll('.slide img');
    fullscreenIndex = (fullscreenIndex - 1 + slides.length) % slides.length;
    updateFullscreenImage();
}

function fullscreenNext() {
    const slides = document.querySelectorAll('.slide img');
    fullscreenIndex = (fullscreenIndex + 1) % slides.length;
    updateFullscreenImage();
}

function updateFullscreenImage() {
    const slides = document.querySelectorAll('.slide img');
    const img = document.getElementById('fullscreenImg');
    const caption = document.getElementById('fullscreenCaption');
    
    if (slides[fullscreenIndex]) {
        img.src = slides[fullscreenIndex].src;
        
        // Get the updated caption with photo position
        const slide = slides[fullscreenIndex].closest('.slide');
        const slideCaption = slide ? slide.querySelector('.slide-caption p').textContent : `Photo ${fullscreenIndex + 1}`;
        caption.textContent = slideCaption;
    }
}

// Close fullscreen on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});
