import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import EventList from './components/EventList.jsx'
import EventDetail from './components/EventDetail.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingBottom: 40 }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e6e9ef', padding: '12px 20px', position: 'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link to="/" style={{ fontWeight:700, color:'#111', fontSize:18 }}>Mini Event Finder</Link>
          <nav>
            <Link to="/" style={{ marginRight:12 }}>Events</Link>
            <a href="#create" style={{ color:'#0b6cff' }}>Create Event</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '18px auto', padding: '0 12px' }}>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </main>
    </div>
  )
}
