import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../api'
import CreateEvent from './CreateEvent.jsx'
import { Link } from 'react-router-dom'

export default function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [radius, setRadius] = useState(5)
  const [userLoc, setUserLoc] = useState(null)
  const [useLocationFilter, setUseLocationFilter] = useState(false)

  async function load() {
    try {
      setError('')
      setLoading(true)
      const params = { q: q || undefined }
      if (useLocationFilter && userLoc) {
        params.lat = userLoc.latitude
        params.lng = userLoc.longitude
        params.radius = radius
      }
      const res = await fetchEvents(params)
      setEvents(res)
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // get user location
  function getLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLoc(pos.coords)
        alert('Location captured — now enable "Use my location" and filter')
      },
      () => alert('Unable to get location')
    )
  }

  return (
    <div className="container">
      <div id="create" className="card" style={{ marginBottom: 14 }}>
        <h3 style={{ margin: 0 }}>Create new event</h3>
        <small className="small">Quickly add a meetup or event</small>
        <CreateEvent onCreated={() => load()} />
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="event-header">
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, description or location" style={{ width:320 }} />
            <button className="btn" onClick={load}>Search</button>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <label style={{ display:'flex', gap:6, alignItems:'center' }}>
              <input type="checkbox" checked={useLocationFilter} onChange={e => setUseLocationFilter(e.target.checked)} />
              <span className="small">Use my location</span>
            </label>
            <button className="btn" onClick={getLocation} style={{ background:'#06ad5e' }}>Capture Location</button>
            <input type="number" className="input" value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width:86 }} /> <span className="small">km radius</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        {loading && <div className="card">Loading events...</div>}
        {error && <div className="card" style={{ color:'red' }}>{error}</div>}
        {!loading && events.length === 0 && <div className="card">No events yet. Create one above.</div>}
        <div style={{ display:'grid', gap:12 }}>
          {events.map(ev => (
            <article key={ev.id} className="card" style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <Link to={`/events/${ev.id}`} style={{ fontWeight:700, fontSize:16 }}>{ev.title}</Link>
                  <div className="small">{ev.locationName || 'Location not provided'} • {new Date(ev.date).toLocaleString()}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  {ev.distanceKm != null && <div className="small">{ev.distanceKm} km</div>}
                  <div className="small">Participants: {ev.currentParticipants}/{ev.maxParticipants}</div>
                </div>
              </div>
              <p style={{ margin: 0, color:'#333' }}>{ev.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
