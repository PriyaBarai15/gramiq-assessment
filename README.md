# Farm Weather & Advisory (MERN)

Simple MERN app that fetches weather (OpenWeatherMap) and generates farmer-friendly advisories.

## Features
- Search by location name (geocoding + forecast)
- Shows current metrics (temp, humidity, wind)
- 5-day forecast (3-hour blocks) trend chart
- Rule-based advisories (rain, heat, wind, humidity, spraying window)
- Optional: saves last 5 searches to MongoDB
- Export advisory to PDF

## Tech
- Frontend: React, Recharts, jspdf, html2canvas
- Backend: Node, Express, Axios, Mongoose (optional)
- Data: OpenWeatherMap API (free tier)

## Setup
1. Create OpenWeather API key: https://openweathermap.org/api
2. Clone this repo
3. Backend:
   - `cd backend`
   - `cp .env.example .env` and fill `OPENWEATHER_KEY` and optionally `MONGO_URI`
   - `npm install`
   - `npm run dev`
4. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`
5. Open `http://localhost:3000`

## Demo video
Record a 2–3 min demo showing:
- Search for a city
- Weather data & chart
- Advisory generated
- Download PDF (optional)
