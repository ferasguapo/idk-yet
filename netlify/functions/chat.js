export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  try {
    const body = JSON.parse(event.body || '{}')
    const messages = body.messages || [{ role: 'user', content: 'Hello!' }]

    if (!process.env.OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY on the server' }) }
    }

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages
      })
    })

    const text = await upstream.text()
    const status = upstream.ok ? 200 : (upstream.status || 500)

    return {
      statusCode: status,
      headers: { 'Content-Type': 'application/json' },
      body: text
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || 'Unknown error' }) }
  }
}
