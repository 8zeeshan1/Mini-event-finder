const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function parseJSON(res) {
  const t = await res.text()
  try { return JSON.parse(t) } catch { return t }
}

export async function fetchEvents({ q, lat, lng, radius } = {}) {
  const params = new URLSearchParams()
  if (q) params.append('q', q)
  if (lat != null) params.append('lat', lat)
  if (lng != null) params.append('lng', lng)
  if (radius != null) params.append('radius', radius)
  const res = await fetch(`${API}/events?${params.toString()}`)
  if (!res.ok) throw new Error(`Error fetching events: ${res.status}`)
  return parseJSON(res)
}

export async function fetchEvent(id) {
  const res = await fetch(`${API}/events/${id}`)
  if (!res.ok) throw new Error('Event not found')
  return parseJSON(res)
}

export async function createEvent(payload) {
  const res = await fetch(`${API}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const body = await parseJSON(res)
    throw new Error(body.message || 'Failed to create event')
  }
  return parseJSON(res)
}
