// Create particles
function createParticles() {
    const particles = document.querySelector('.particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#ff4655';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            iterations: Infinity
        });
        
        particles.appendChild(particle);
    }
}

// Create geometric shapes
function createGeometricShapes() {
    const container = document.querySelector('.geometric-shapes');
    const shapes = ['triangle', 'square', 'circle'];
    
    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        shape.className = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.position = 'absolute';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.border = '1px solid rgba(255, 70, 85, 0.3)';
        shape.style.width = (20 + Math.random() * 30) + 'px';
        shape.style.height = (20 + Math.random() * 30) + 'px';
        
        const animation = shape.animate([
            { transform: 'rotate(0deg) scale(1)', opacity: 0.3 },
            { transform: 'rotate(360deg) scale(1.5)', opacity: 0 }
        ], {
            duration: 5000 + Math.random() * 5000,
            iterations: Infinity
        });
        
        container.appendChild(shape);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createGeometricShapes();
});

// Add hover effect to letters
const letters = document.querySelectorAll('.valorant-text');
letters.forEach(letter => {
    letter.addEventListener('mouseover', () => {
        letter.style.transform = `skewX(-10deg) translateY(-5px)`;
        letter.style.color = '#ff4655';
    });
    
    letter.addEventListener('mouseout', () => {
        letter.style.transform = 'skewX(0) translateY(0)';
        letter.style.color = '#fff';
    });
});
