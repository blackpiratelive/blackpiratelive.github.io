export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const MOOD_API_TOKEN = process.env.MOOD_API_TOKEN;
    const MOOD_API_URL = 'https://mood-tracker.blackpiratex.com/api/external';

    if (!MOOD_API_TOKEN) {
        return res.status(500).send('could not load mood data');
    }

    try {
        const response = await fetch(MOOD_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MOOD_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Mood API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Get today's date in YYYY-MM-DD format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        // Find today's entry
        const todayEntry = data.entries.find(entry => {
            if (!entry.dateKey) return false;
            const entryDate = entry.dateKey.split('T')[0];
            return entryDate === todayStr;
        });

        if (!todayEntry) {
            return res.send('no mood logged today yet');
        }

        // Mood labels mapping
        const moodLabels = {
            '😭': 'terrible',
            '😢': 'very sad',
            '😔': 'sad',
            '😐': 'neutral',
            '🙂': 'okay',
            '😊': 'good',
            '😄': 'happy',
            '😁': 'very happy',
            '🤩': 'amazing',
            '🥳': 'fantastic'
        };

        const moodEmoji = todayEntry.mood;
        const moodLabel = moodLabels[moodEmoji] || 'logged';
        
        // Format date
        const date = new Date(todayEntry.date || todayEntry.dateKey);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).toLowerCase();

        // Get activities
        const entryActivities = data.entryActivities.filter(ea => ea.entry_id === todayEntry.id);
        const activitiesText = entryActivities.length > 0 
            ? `<div style="font-size: 0.9rem; color: #555;">activities: ${entryActivities.map(ea => escapeHtml(ea.activity_name)).join(', ')}</div>`
            : '';

        // Return formatted HTML
        const html = `
            <div style="margin-bottom: 0.5rem;">
                <span style="font-weight: 600;">today's mood:</span>
                <span style="font-size: 1.5rem; margin-left: 0.5rem;">${moodEmoji}</span>
                <span style="margin-left: 0.5rem; font-style: italic;">${moodLabel}</span>
            </div>
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.75rem;">${dateStr}</div>
            ${activitiesText}
        `;

        return res.send(html);

    } catch (error) {
        console.error('Error fetching mood:', error);
        return res.send('could not load mood data');
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}