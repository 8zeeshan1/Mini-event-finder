const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * In-memory events store:
 * Each event: {
 *   id, title, description, locationName,
 *   lat, lng, date (ISO string), maxParticipants, currentParticipants
 * }
 */
const EVENTS = [];

/** Helper: Haversine distance (km) */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * POST /api/events
 * body: { title, description, locationName, lat, lng, date, maxParticipants }
 */
router.post('/', (req, res) => {
  try {
    const { title, description, locationName, lat, lng, date, maxParticipants } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'title and date are required' });
    }
    const ev = {
      id: uuidv4(),
      title: String(title),
      description: description ? String(description) : '',
      locationName: locationName ? String(locationName) : '',
      lat: typeof lat === 'number' ? lat : null,
      lng: typeof lng === 'number' ? lng : null,
      date: new Date(date).toISOString(),
      maxParticipants: Number(maxParticipants) || 0,
      currentParticipants: 0,
      createdAt: new Date().toISOString()
    };
    EVENTS.push(ev);
    return res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/events
 * query:
 *   q - text search across title/description/locationName
 *   lat, lng, radius (km) - filter by distance from provided coords
 */
router.get('/', (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q).toLowerCase() : null;
    const lat = req.query.lat ? Number(req.query.lat) : null;
    const lng = req.query.lng ? Number(req.query.lng) : null;
    const radius = req.query.radius ? Number(req.query.radius) : null;

    let results = EVENTS.slice(); // copy

    if (q) {
      results = results.filter(e => {
        return (
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.locationName && e.locationName.toLowerCase().includes(q))
        );
      });
    }

    if (lat !== null && lng !== null && Number.isFinite(radius)) {
      results = results
        .map(e => {
          if (e.lat === null || e.lng === null) {
            return null; // can't compute
          }
          const dist = haversineDistanceKm(lat, lng, e.lat, e.lng);
          return { ...e, distanceKm: Number(dist.toFixed(3)) };
        })
        .filter(x => x && x.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm); // closest first
    } else if (lat !== null && lng !== null) {
      // add distance but don't filter
      results = results
        .map(e => (e.lat !== null && e.lng !== null ? { ...e, distanceKm: Number(haversineDistanceKm(lat, lng, e.lat, e.lng).toFixed(3)) } : e))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      // sort by date ascending
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/events/:id
 */
router.get('/:id', (req, res) => {
  const ev = EVENTS.find(e => e.id === req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  return res.json(ev);
});

module.exports = router;
