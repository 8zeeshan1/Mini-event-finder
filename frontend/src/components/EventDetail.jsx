import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchEvent } from '../api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setErr(''); setLoading(true)
        const e = await fetchEvent(id)
        setEvent(e)
      } catch (err) {
        setErr(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="card">Loading event...</div>
  if (err) return <div className="card" style={{ color:'red' }}>{err}</div>
  if (!event) return <div className="card">Event not found</div>

  return (
    <div className="container">
      <div className="card">
        <Link to="/" style={{ display:'inline-block', marginBottom:10 }}>&larr; Back to events</Link>
        <h2 style={{ marginTop:0 }}>{event.title}</h2>
        <div className="small">{event.locationName || 'Location not provided'} • {new Date(event.date).toLocaleString()}</div>
        <p style={{ marginTop:12 }}>{event.description}</p>
        {event.lat && event.lng && <div className="small">Coordinates: {event.lat}, {event.lng}</div>}
        <div style={{ marginTop:12 }}>
          <strong>Participants:</strong> {event.currentParticipants}/{event.maxParticipants}
        </div>
      </div>
    </div>
  )
}
