# Mini Event Finder

A simplified full-stack event discovery application built using **Node.js + Express** (Backend) and **React + Vite** (Frontend).  
Users can create events, view event details, and browse a list of upcoming events.

---

## 🚀 Live Demo

### ✅ Frontend (Netlify)  
🔗 https://mini-event-finder.netlify.app/

### ✅ Backend API (Render)  
🔗 https://mini-event-finder-rk98.onrender.com/api

---

## 📌 Features

### ✅ Frontend
- List all events  
- View event details  
- Submit a new event  
- Responsive UI  
- Loading & error handling  
- Basic search/filter (optional)

### ✅ Backend
- REST API with:
  - `POST /api/events` – Create event
  - `GET /api/events` – Get all events
  - `GET /api/events/:id` – Get event by ID
- In-memory event storage (as instructed in assignment)
- CORS configured for Netlify frontend
- Input validation

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- Vite  
- CSS  
- Fetch API  
- Environment Variables (`VITE_API_URL`)

### **Backend**
- Node.js  
- Express.js  
- CORS  

### **Deployment**
- **Netlify** → Frontend  
- **Render** → Backend  

---

## 📁 Project Structure
Mini-event-finder/
│
├── backend/
│ ├── server.js
│ ├── routes/
│ │ └── events.js
│ └── package.json
│
└── frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── App.jsx
│ └── main.jsx
├── index.html
├── vite.config.js
└── package.json


---

## 🔧 Installation & Setup (Local Development)

### ✅ 1. Clone the Repository
```bash
git clone https://github.com/8zeeshan1/Mini-event-finder.git
cd Mini-event-finder

cd backend
npm install
npm start
http://localhost:8000/api

cd frontend
npm install
VITE_API_URL=http://localhost:8000/api
npm run dev
http://localhost:5173

