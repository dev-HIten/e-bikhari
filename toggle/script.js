class Toggle {
    constructor() {
        this.button = document.querySelector('.toggle-button');
        this.body = document.body;
        this.isActive = false;
        this.clickSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPz8/Pz8/TU1NTU1NW1tbW1tbampoaGhoaHd3d3d3d4aGhoaGhpSUlJSUlKOjo6Ojo7GxsbGxsb+/v7+/v87Ozs7Oztzc3Nzc3Orq6urq6v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tUxAAB8AAAaQAAAAgAAA0gAAABAZYdz1hQGPoFwJwTB2D4Zjuy/+KZ67+8FxTx+M45Jw+GScdxwOGPkP8b0OTi8PwfB8H4fTh+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D//tUxBOADeABLAAAAACAAACXAAAAEPg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4P/+1LEOwAAAAABpAAAAAAAADSAAAAAg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg//tUxDmACZABHQAAAAAAANIAAAAQAA');
        
        this.init();
    }

    init() {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.activate();
        }

        // Add event listeners
        this.button.addEventListener('click', (e) => this.handleClick(e));
        this.button.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleClick(e) {
        // Create ripple effect
        this.createRipple(e);
        
        // Play sound
        this.playClickSound();
        
        // Toggle state
        this.toggle();
        
        // Add particle burst
        this.createParticleBurst(e);
    }

    createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    createParticleBurst(e) {
        const particles = 10;
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--angle', `${(360 / particles) * i}deg`);
            this.button.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    handleMouseMove(e) {
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (x - centerX) / centerX * 10;
        const angleY = (y - centerY) / centerY * 10;
        
        this.button.style.transform = `perspective(1000px) rotateX(${-angleY}deg) rotateY(${angleX}deg) scale(1.05)`;
    }

    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        this.isActive = true;
        this.button.classList.add('active');
        this.body.classList.add('dark');
    }

    deactivate() {
        this.isActive = false;
        this.button.classList.remove('active');
        this.body.classList.remove('dark');
    }

    playClickSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(err => console.log('Audio error:', err));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Toggle();
});
