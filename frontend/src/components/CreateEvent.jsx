import React, { useState } from 'react'
import { createEvent } from '../api'

export default function CreateEvent({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [date, setDate] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(50)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!title || !date) { setErr('Title and date required'); return }
    const body = {
      title, description, locationName,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      date, maxParticipants: Number(maxParticipants)
    }
    try {
      setLoading(true)
      await createEvent(body)
      setTitle(''); setDescription(''); setLocationName(''); setLat(''); setLng(''); setDate(''); setMaxParticipants(50)
      if (onCreated) onCreated()
    } catch (err) {
      setErr(err.message || 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop:10, display:'grid', gap:8 }}>
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Event title" />
      <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" rows={3} />
      <input className="input" value={locationName} onChange={e=>setLocationName(e.target.value)} placeholder="Location name (e.g. City Hall)" />
      <div style={{ display:'flex', gap:8 }}>
        <input className="input" value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude (optional)" />
        <input className="input" value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude (optional)" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <input type="datetime-local" className="input" value={date} onChange={e=>setDate(e.target.value)} />
        <input type="number" className="input" value={maxParticipants} onChange={e=>setMaxParticipants(e.target.value)} style={{ width:160 }} />
      </div>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <div style={{ display:'flex', gap:8 }}>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
      </div>
    </form>
  )
}
