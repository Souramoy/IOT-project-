# Explainable IoT Smart System (Demo Version)

A complete frontend-only web application that simulates an IoT smart system with AI-powered explanations using Google Gemini API.

## Features

- **Admin Panel**: Secure login system for administrators to input sensor data
- **Sensor Data Management**: Manual entry of various sensor readings including:
  - Temperature (°C)
  - Humidity (%)
  - Air Quality Index (AQI)
  - Gas Level (ppm)
  - Motion Detection (Yes/No)
- **Client Dashboard**: Visual display of sensor data with:
  - Real-time sensor cards
  - Interactive charts showing trends over time
  - AI-powered explanations of sensor readings
- **LocalStorage Persistence**: All data stored locally in the browser
- **Explainable AI**: Integration with Google Gemini API to generate insights about sensor readings

## Technology Stack

- **React.js** with Vite
- **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Google Gemini API** for AI explanations
- **LocalStorage** for data persistence

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gemini API Key

To enable the AI explanation feature, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Open the `.env` file in the project root
4. Replace `your_gemini_api_key_here` with your actual API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Application

The development server starts automatically. If not, run:

```bash
npm run dev
```

## Usage Guide

### Admin Access

1. Navigate to `/admin` or click "Admin Panel" from the dashboard
2. Login with credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Once logged in, you'll see the sensor input form

### Adding Sensor Data

1. Fill in the sensor data form with values:
   - Temperature (e.g., 25.5)
   - Humidity (0-100)
   - Air Quality Index (e.g., 120)
   - Gas Level (e.g., 200)
   - Motion Detected (Yes/No)
2. Click "Submit Sensor Data"
3. The data will be saved and displayed in the history table

### Viewing Dashboard

1. Navigate to `/dashboard` or click "View Client Dashboard"
2. See current sensor readings in visual cards
3. View trend charts (appears after adding multiple data points)
4. Click "Generate Explanation" to get AI-powered insights

### AI Explanation Feature

The AI explanation analyzes your sensor data and provides:
- Environmental condition assessment
- Possible reasons for current readings
- Contributing factors
- Recommendations based on the data

## Routes

- `/` - Redirects to dashboard
- `/admin` - Admin login page
- `/admin/dashboard` - Admin panel for data entry
- `/dashboard` - Client dashboard with visualizations

## Project Structure

```
src/
├── pages/
│   ├── AdminLogin.jsx          # Admin login interface
│   ├── AdminDashboard.jsx      # Sensor data input form
│   └── ClientDashboard.jsx     # Data visualization dashboard
├── components/
│   ├── SensorCard.jsx          # Reusable sensor display card
│   ├── ChartComponent.jsx      # Chart wrapper for Recharts
│   └── ExplanationCard.jsx     # AI explanation interface
├── utils/
│   ├── storage.js              # LocalStorage management
│   └── gemini.js               # Gemini API integration
└── App.tsx                      # Main app with routing
```

## Data Storage

All data is stored in the browser's LocalStorage:
- Sensor readings with timestamps
- Admin login state

To clear all data, open browser console and run:
```javascript
localStorage.clear()
```

## Important Notes

- This is a **demo prototype** for educational purposes
- No real IoT sensors are connected
- All data is simulated and entered manually
- Data persists only in the browser (cleared if cache is cleared)
- Gemini API key is required for AI explanations to work

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Demo Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## Project Purpose

This application demonstrates the integration of:
- IoT sensor data visualization
- Explainable AI capabilities
- Modern web development practices

Perfect for final year projects, demonstrations, or learning purposes.
