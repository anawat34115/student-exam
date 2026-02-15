// Page Transition Effects
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add page transition class to body on load
        this.addPageTransition();
        
        // Handle navigation clicks for smooth transitions
        this.setupNavigationHandlers();
        
        // Add staggered animations to specific containers
        this.setupStaggeredAnimations();
        
        // Handle browser back/forward buttons
        this.setupBrowserNavigation();
    }

    addPageTransition() {
        // Add fade-in effect when page loads
        document.body.classList.add('page-transition');
        
        // Remove the class after animation completes
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 600);
    }

    setupNavigationHandlers() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('nav a, .btn');
        
        navLinks.forEach(link => {
            // Skip external links and anchors
            if (link.hostname !== window.location.hostname || 
                link.href.includes('#') || 
                link.onclick) {
                return;
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Add exit animation
                document.body.classList.add('page-exit');
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = link.href;
                }, 400);
            });
        });
    }

    setupStaggeredAnimations() {
        // Add staggered animations to hobby grids
        const hobbyGrids = document.querySelectorAll('.hobby-grid, .multimedia-container, .contact-grid');
        
        hobbyGrids.forEach(grid => {
            grid.classList.add('stagger-animation');
        });

        // Add animations to game elements
        const gameCards = document.querySelectorAll('.memory-card');
        gameCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupBrowserNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Page was restored from back/forward cache
                this.addPageTransition();
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible again
                this.addPageTransition();
            }
        });
    }

    // Utility method to add custom animations
    addAnimation(element, animationClass, delay = 0) {
        if (element) {
            element.classList.add(animationClass);
            if (delay > 0) {
                element.style.animationDelay = `${delay}s`;
            }
        }
    }

    // Method to animate elements on scroll (for future use)
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const elementsToObserve = document.querySelectorAll('.card, section');
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize page transitions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTransitions;
}
