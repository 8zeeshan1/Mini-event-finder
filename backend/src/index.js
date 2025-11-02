const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 8000;

// Allow local dev and (later) deployed frontends. For quick demo allow all origins:
app.use(cors()); // simple: allow all origins
app.use(express.json());

app.use('/api/events', eventsRouter);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log('Mini Event Finder backend running on port', PORT);
});
