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
    const MOOD_API_URL = 'https://mood-tracker.blackpiratex.com/api/external';  // ✅ Added https://

    if (!MOOD_API_TOKEN) {
        return res.status(500).json({ error: 'API token not configured' });
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
            const errorText = await response.text();
            console.error('Mood API Error:', response.status, errorText);
            throw new Error(`Mood API Error: ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching mood:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch mood data',
            details: error.message 
        });
    }
}