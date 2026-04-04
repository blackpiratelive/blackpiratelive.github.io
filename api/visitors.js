export default async function handler(req, res) {
  const baseUrl = process.env.UMAMI_BASE_URL;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;
  const siteId = process.env.UMAMI_SITE_ID;
  const startDate = process.env.UMAMI_START_DATE || '2025-11-02';

  if (!baseUrl || !username || !password || !siteId) {
    res.status(500).json({ error: 'Missing Umami configuration.' });
    return;
  }

  const startAt = new Date(startDate).getTime();
  const endAt = Date.now();

  if (!Number.isFinite(startAt)) {
    res.status(500).json({ error: 'Invalid UMAMI_START_DATE.' });
    return;
  }

  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!loginRes.ok) {
      res.status(502).json({ error: 'Unable to authenticate with Umami.' });
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData && loginData.token;

    if (!token) {
      res.status(502).json({ error: 'Missing Umami token.' });
      return;
    }

    const authHeaders = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    };

    const parseCount = (data) => {
      if (data && typeof data === 'object') {
        const direct = data.visitors ?? data.uniqueVisitors ?? data.uniques ?? data.visits;
        if (Number.isFinite(direct)) {
          return direct;
        }
      }

      if (Array.isArray(data)) {
        return data.reduce((sum, item) => {
          if (!item || typeof item !== 'object') {
            return sum;
          }
          const value = item.y ?? item.value ?? item.visitors;
          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);
      }

      return null;
    };

    let count = null;

    const statsUrl = `${baseUrl}/api/websites/${siteId}/stats?startAt=${startAt}&endAt=${endAt}`;
    const statsRes = await fetch(statsUrl, { headers: authHeaders });

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      count = parseCount(statsData);
    }

    if (!Number.isFinite(count)) {
      const metricsUrl = `${baseUrl}/api/websites/${siteId}/metrics?type=visitors&startAt=${startAt}&endAt=${endAt}`;
      const metricsRes = await fetch(metricsUrl, { headers: authHeaders });

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        count = parseCount(metricsData);
      }
    }

    if (!Number.isFinite(count)) {
      res.status(502).json({ error: 'Unable to read Umami visitor stats.' });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.status(200).json({ visitors: count });
  } catch (err) {
    res.status(500).json({ error: 'Visitor stats failed.' });
  }
}
