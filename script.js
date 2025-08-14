// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

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

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !service || !message) {
            showNotification('Please fill in all fields!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address!', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Your project request has been sent successfully!', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 95 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 95 ? '%' : '+');
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Interactive Constellation Mouse Movement
function initInteractiveConstellation() {
    const constellation = document.querySelector('.interactive-constellation');
    if (!constellation) return;

    const stars = constellation.querySelectorAll('.star');
    const lines = constellation.querySelectorAll('.line');
    const particles = constellation.querySelectorAll('.particle');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate normalized mouse position (-1 to 1)
        const normalizedX = (mouseX / windowWidth) * 2 - 1;
        const normalizedY = (mouseY / windowHeight) * 2 - 1;

        // Move stars based on mouse position
        stars.forEach((star, index) => {
            const speed = 0.02 + (index * 0.005);
            const moveX = normalizedX * speed * 20;
            const moveY = normalizedY * speed * 15;
            
            star.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        // Move lines based on mouse position
        lines.forEach((line, index) => {
            const speed = 0.015 + (index * 0.003);
            const moveX = normalizedX * speed * 15;
            const moveY = normalizedY * speed * 10;
            
            line.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        // Move particles based on mouse position
        particles.forEach((particle, index) => {
            const speed = 0.025 + (index * 0.004);
            const moveX = normalizedX * speed * 25;
            const moveY = normalizedY * speed * 20;
            
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Initialize interactive constellation
document.addEventListener('DOMContentLoaded', function() {
    initInteractiveConstellation();
});

// Initialize full page constellation interaction
function initFullPageConstellation() {
    const bgStars = document.querySelectorAll('.bg-star');
    const bgLines = document.querySelectorAll('.bg-line');
    const bgParticles = document.querySelectorAll('.bg-particle');
    
    // Mouse move event for full page constellation
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Parallax effect for background stars
        bgStars.forEach((star, index) => {
            const speed = (index + 1) * 0.2;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Parallax effect for background lines
        bgLines.forEach((line, index) => {
            const speed = (index + 1) * 0.15;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            line.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Parallax effect for background particles
        bgParticles.forEach((particle, index) => {
            const speed = (index + 1) * 0.25;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Add hover effects for stars
    bgStars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            star.style.transform = 'scale(1.5)';
            star.style.boxShadow = '0 0 25px var(--accent-color)';
        });
        
        star.addEventListener('mouseleave', () => {
            star.style.transform = 'scale(1)';
            star.style.boxShadow = '0 0 10px var(--accent-color)';
        });
    });
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .stat, .text-card, .portfolio-item, .tech-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize counter animations
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const heroCounters = heroStats.querySelectorAll('.stat-number[data-target]');
        heroCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
        });
    }

    // Initialize buttons
    initButtons();
    
    // Initialize tech items
    initTechItems();
    
    // Add some interactive hover effects
    document.querySelectorAll('.service-card, .portfolio-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add parallax effect to hero constellation stars
    window.addEventListener('mousemove', (e) => {
        const constellationStars = document.querySelectorAll('.constellation-star');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        constellationStars.forEach((star, index) => {
            const speed = (index + 1) * 0.3;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Initialize full page constellation interaction
    initFullPageConstellation();
});

// Button click effects and functionality
function initButtons() {
    document.querySelectorAll('.btn').forEach(button => {
        // Remove existing event listeners to prevent duplicates
        button.removeEventListener('click', button.clickHandler);
        
        button.clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Handle button functionality
            const buttonText = this.textContent.trim();
            
            if (buttonText.includes('Explore Services')) {
                document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
            } else if (buttonText.includes('AI Demo')) {
                showAIDemo();
            } else if (buttonText.includes('Start Project')) {
                // Form submission is already handled
                return;
            }
        };
        
        button.addEventListener('click', button.clickHandler);
    });
}

// AI Demo Modal
function showAIDemo() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content ai-demo-modal">
            <div class="modal-header">
                <div class="demo-header">
                    <i class="fas fa-brain"></i>
                    <h2>AI Demo Experience</h2>
                </div>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="demo-visual">
                    <div class="ai-animation">
                        <div class="neural-node"></div>
                        <div class="neural-node"></div>
                        <div class="neural-node"></div>
                        <div class="neural-connection"></div>
                        <div class="neural-connection"></div>
                        <div class="neural-connection"></div>
                    </div>
                </div>
                <div class="demo-content">
                    <h3>Experience Our AI Solutions</h3>
                    <p>Watch our AI systems in action, processing data and making intelligent decisions in real-time.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Predictive Analytics</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-comments"></i>
                            <span>Natural Language Processing</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-eye"></i>
                            <span>Computer Vision</span>
                        </div>
                    </div>
                    <button class="btn btn-primary demo-start-btn">
                        <span>Start Demo</span>
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .ai-demo-modal {
            background: #1e293b;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
            border: 1px solid rgba(99, 102, 241, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .demo-header {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .demo-header i {
            font-size: 2.5rem;
            color: #06b6d4;
        }
        
        .demo-header h2 {
            margin: 0;
            color: #f8fafc;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #cbd5e1;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(99, 102, 241, 0.1);
            color: #f8fafc;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .demo-visual {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .ai-animation {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
        
        .neural-node {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #06b6d4;
            border-radius: 50%;
            animation: nodePulse 2s ease-in-out infinite;
        }
        
        .neural-node:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
        .neural-node:nth-child(2) { top: 60%; right: 20%; animation-delay: 0.5s; }
        .neural-node:nth-child(3) { bottom: 20%; left: 50%; animation-delay: 1s; }
        
        .neural-connection {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, #06b6d4, #6366f1);
            animation: connectionFlow 3s ease-in-out infinite;
        }
        
        .neural-connection:nth-child(4) {
            top: 30%;
            left: 30%;
            width: 40%;
            transform: rotate(45deg);
            animation-delay: 0s;
        }
        
        .neural-connection:nth-child(5) {
            top: 70%;
            left: 30%;
            width: 40%;
            transform: rotate(-45deg);
            animation-delay: 1s;
        }
        
        .neural-connection:nth-child(6) {
            top: 50%;
            left: 20%;
            width: 60%;
            transform: rotate(0deg);
            animation-delay: 2s;
        }
        
        .demo-content h3 {
            color: #f8fafc;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .demo-content p {
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .demo-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .demo-feature {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: #0f172a;
            border-radius: 12px;
            border: 1px solid rgba(99, 102, 241, 0.1);
        }
        
        .demo-feature i {
            color: #06b6d4;
            font-size: 1.2rem;
        }
        
        .demo-feature span {
            color: #f8fafc;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .demo-start-btn {
            width: 100%;
            justify-content: center;
        }
        
        @keyframes nodePulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes connectionFlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .ai-demo-modal {
                width: 95%;
                margin: 1rem;
            }
            
            .demo-features {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        modalStyles.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            modalStyles.remove();
        }
    });

    // Demo start button
    const demoStartBtn = modal.querySelector('.demo-start-btn');
    demoStartBtn.addEventListener('click', () => {
        showNotification('AI Demo started! Processing data...', 'success');
        setTimeout(() => {
            showNotification('AI analysis complete! Results generated successfully.', 'success');
        }, 3000);
    });
}

// Tech items interaction
function initTechItems() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            const techName = item.getAttribute('data-tech');
            showTechModal(techName);
        });
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Tech modal
function showTechModal(techName) {
    const techInfo = {
        'AI/ML': {
            description: 'Advanced artificial intelligence and machine learning solutions',
            experience: '5+ years',
            projects: '40+ projects',
            icon: 'fas fa-brain',
            color: '#FF6F00'
        },
        'Web': {
            description: 'Modern web development with React, Next.js and cutting-edge technologies',
            experience: '6+ years',
            projects: '50+ projects',
            icon: 'fab fa-react',
            color: '#61DAFB'
        },
        'Python': {
            description: 'Python development for AI, automation and backend services',
            experience: '4+ years',
            projects: '35+ projects',
            icon: 'fab fa-python',
            color: '#3776AB'
        },
        'Node': {
            description: 'Node.js backend development and API services',
            experience: '4+ years',
            projects: '30+ projects',
            icon: 'fab fa-node-js',
            color: '#339933'
        },
        'Design': {
            description: 'UI/UX design and user experience optimization',
            experience: '3+ years',
            projects: '25+ projects',
            icon: 'fab fa-figma',
            color: '#F24E1E'
        },
        'Cloud': {
            description: 'Cloud infrastructure and DevOps solutions',
            experience: '3+ years',
            projects: '20+ projects',
            icon: 'fas fa-cloud',
            color: '#FF9900'
        }
    };
    
    const tech = techInfo[techName];
    if (!tech) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content tech-modal">
            <div class="modal-header">
                <div class="tech-header">
                    <i class="${tech.icon}" style="color: ${tech.color}"></i>
                    <h2>${techName}</h2>
                </div>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tech-details">
                    <div class="tech-description">
                        <h3>Description</h3>
                        <p>${tech.description}</p>
                    </div>
                    <div class="tech-stats">
                        <div class="tech-stat">
                            <i class="fas fa-clock"></i>
                            <span>${tech.experience}</span>
                        </div>
                        <div class="tech-stat">
                            <i class="fas fa-folder"></i>
                            <span>${tech.projects}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: #1e293b;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
            border: 1px solid rgba(99, 102, 241, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .tech-header {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .tech-header i {
            font-size: 2.5rem;
        }
        
        .tech-header h2 {
            margin: 0;
            color: #f8fafc;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #cbd5e1;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(99, 102, 241, 0.1);
            color: #f8fafc;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .tech-details {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .tech-description h3 {
            color: #f8fafc;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .tech-description p {
            color: #cbd5e1;
            line-height: 1.6;
        }
        
        .tech-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .tech-stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: #0f172a;
            border-radius: 12px;
            border: 1px solid rgba(99, 102, 241, 0.1);
        }
        
        .tech-stat i {
            color: #06b6d4;
            font-size: 1.2rem;
        }
        
        .tech-stat span {
            font-weight: 600;
            color: #f8fafc;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        modalStyles.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            modalStyles.remove();
        }
    });
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add interactive cursor effects
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const cursorElement = document.createElement('div');
        cursorElement.className = 'cursor';
        document.body.appendChild(cursorElement);
    }
    
    const cursorElement = document.querySelector('.cursor');
    cursorElement.style.left = e.clientX + 'px';
    cursorElement.style.top = e.clientY + 'px';
});

// Add cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transition: transform 0.1s ease;
    }
    
    .cursor.hover {
        transform: scale(2);
        background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%);
    }
`;
document.head.appendChild(cursorStyle);

// Add hover effects to interactive elements
document.querySelectorAll('button, .btn, .nav-link, .tech-item, .service-card, .portfolio-item').forEach(element => {
    element.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.classList.remove('hover');
    });
});
