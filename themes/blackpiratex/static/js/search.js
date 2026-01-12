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
                keys: ['title', 'tags', 'summary'],
                threshold: 0.4,
                ignoreLocation: true
            };
            fuse = new Fuse(data, options);
        });

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }

        const results = fuse.search(query);
        
        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            let html = '';
            results.forEach(result => {
                const item = result.item;
                html += `
                <a href="${item.permalink}" class="search-result-item">
                    <div style="color: #0000AA; font-weight: bold;">${item.title}</div>
                    <div style="font-size: 12px; color: #666;">${item.date}</div>
                </a>`;
            });
            resultsContainer.innerHTML = html;
        } else {
            resultsContainer.style.display = 'none';
        }
    });
});