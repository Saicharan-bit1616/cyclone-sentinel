# 🌀 CYCLONE SENTINEL — AI-Powered Disaster Intelligence & Infrastructure Risk System

> **Build with AI: Code for Communities Hackathon Submission**
> An AI-driven early-warning, hazard mapping, and infrastructure vulnerability assessment dashboard designed to protect life, property, and critical community assets during extreme cyclone events.

---

## 📌 Executive Summary

**Cyclone Sentinel** is an advanced operational decision-support system designed for emergency operation centers (EOCs), first responders, and municipal planners. Powered by Google Gemini AI and real-time geospatial hazard intelligence, Cyclone Sentinel transforms raw meteorological and infrastructure data into actionable, prioritized mitigation strategies before cyclone landfall.

---

## ✨ Key Features

- **🌐 Interactive Geospatial Satellite Map**: Real-time Leaflet visualization of cyclone trajectories, coastal inundation zones, extreme wind corridors, and critical community assets.
- **🤖 Gemini AI Tactical Intelligence**: Automated vulnerability diagnosis, consequence analysis, and 3-step action recommendations generated dynamically per infrastructure asset using `@google/genai` (with zero-downtime deterministic rule engine fallback).
- **📊 Real-time Telemetry & KPI Header**: High-visibility monitoring of storm category, wind speed, central pressure, affected population count, and high-risk facility counts.
- **🏥 Multi-Sector Asset Management**: Dedicated tracking and filtering across Hospitals, Power Stations, Evacuation Shelters, Potable Water Networks, and Transport Corridors.
- **⚠️ Actionable Early Alerts**: Severity-ranked dispatch alerts with direct deep-linking to spatial locations and AI mitigation protocols.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Lucide Icons, Glassmorphism design system
- **Geospatial & Visualizations**: Leaflet, React-Leaflet, Recharts
- **Artificial Intelligence**: `@google/genai` (Google Gemini 2.5 Flash API) with offline rule engine fallback
- **Deployment**: Vercel

---

## 🚀 Quick Start & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/cyclone-sentinel.git
cd cyclone-sentinel

# 2. Install dependencies
npm install

# 3. (Optional) Set up Gemini API Key
cp .env.example .env
# Add VITE_GEMINI_KEY=your_key_here

# 4. Start local development server
npm run dev
```

---

## 📄 License
Distributed under the MIT License. Built for community resilience and disaster response.
