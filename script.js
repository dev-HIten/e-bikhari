async function loadProjects() {
    try {
        // Fetch the list of files in the current directory
        const response = await fetch('/api/files');
        const files = await response.json();

        const projectsGrid = document.getElementById('projectsGrid');
        
        files.forEach((file, index) => {
            // Skip index.html and system files
            if (file.name === 'index.html' || file.name.startsWith('.')) {
                return;
            }

            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Create the card content
            card.innerHTML = `
                <h2 class="project-title">${file.name}</h2>
                <p class="project-description">
                    Last modified: ${new Date(file.lastModified).toLocaleDateString()}
                    <br>
                    Size: ${formatFileSize(file.size)}
                </p>
                <a href="${file.path}" class="project-link">View Project</a>
            `;
            
            projectsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML = `
            <div class="error-message">Error loading projects. Please try again later.</div>
        `;
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load projects when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);
