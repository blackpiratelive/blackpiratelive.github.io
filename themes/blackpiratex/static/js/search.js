document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchInput) return;

    // Initialize Fuse with empty data
    let fuse;
    
    // Fetch index.json
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            const options = {
                keys: ['title', 'content', 'summary'],
                threshold: 0.3,
                ignoreLocation: true,
                minMatchCharLength: 2
            };
            fuse = new Fuse(data, options);
        })
        .catch(error => console.error('Error loading search index:', error));

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }

        const results = fuse.search(query).slice(0, 8);
        
        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            let html = '';
            results.forEach(result => {
                const item = result.item;
                html += `
                <a href="${item.permalink}" class="search-result-item" title="${item.title}">
                    <i data-lucide="arrow-right" width="16"></i>
                    <span>${item.title}</span>
                </a>`;
            });
            resultsContainer.innerHTML = html;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            resultsContainer.style.display = 'none';
        }
    });
});