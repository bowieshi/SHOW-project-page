window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Showcase video autoplay when in view
function setupShowcaseVideoAutoplay() {
    const showcaseVideos = document.querySelectorAll('.video-autoplay');

    if (showcaseVideos.length === 0) return;

    const tryPlay = (video) => {
        if (video.readyState >= 1) {
            try {
                video.currentTime = 0;
            } catch (error) {
                console.log('Could not reset video time:', error);
            }
        }
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((error) => {
                console.log('Autoplay prevented:', error);
            });
        }
    };

    const ensurePlayable = (video) => {
        if (video.readyState >= 2) {
            tryPlay(video);
            return;
        }

        const resumeWhenReady = () => {
            tryPlay(video);
        };

        video.addEventListener('canplay', resumeWhenReady, { once: true });
        video.addEventListener('loadeddata', resumeWhenReady, { once: true });
        video.load();
        setTimeout(resumeWhenReady, 250);
    };

    showcaseVideos.forEach((video) => {
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'auto');

        if (video.classList.contains('ablation-video')) {
            video.load();
            tryPlay(video);
            setTimeout(() => tryPlay(video), 250);
        }

        video.addEventListener('loadedmetadata', () => {
            try {
                video.currentTime = 0;
            } catch (error) {
                console.log('Could not reset video time:', error);
            }
        });

        video.addEventListener('ended', () => {
            tryPlay(video);
        });
    });

    if (!('IntersectionObserver' in window)) {
        showcaseVideos.forEach(tryPlay);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                ensurePlayable(video);
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '200px 0px'
    });

    showcaseVideos.forEach((video) => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup autoplay for the teaser and showcase videos
    setupShowcaseVideoAutoplay();

})
