import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  Plus,
  Eye
} from 'lucide-react';

import {
  saveSensorData,
  getSensorData,
  getLoginState,
  logout
} from '../utils/storage';

const AdminDashboard = () => {

  const navigate = useNavigate();

  // ===============================
  // STATES
  // ===============================

  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    aqi: '',
    gas: '',
    motion: 'false',
  });

  const [sensorHistory, setSensorHistory] = useState([]);

  const [successMessage, setSuccessMessage] = useState('');

  // AUTO MODE STATES
  const [autoMode, setAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState(null);
  const [hazardInterval, setHazardInterval] = useState(null);


  // ===============================
  // AUTH CHECK
  // ===============================

  useEffect(() => {

    const loginState = getLoginState();

    if (!loginState.isLoggedIn) {

      navigate('/admin');

    } else {

      loadSensorHistory();

    }

  }, [navigate]);


  // ===============================
  // CLEANUP INTERVALS
  // ===============================

  useEffect(() => {

    return () => {

      if (autoInterval) clearInterval(autoInterval);

      if (hazardInterval) clearInterval(hazardInterval);

    };

  }, [autoInterval, hazardInterval]);


  // ===============================
  // LOAD HISTORY
  // ===============================

  const loadSensorHistory = () => {

    const data = getSensorData();

    setSensorHistory(data.reverse());

  };


  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // ===============================
  // MANUAL SUBMIT
  // ===============================

  const handleSubmit = (e) => {

    e.preventDefault();

    const sensorData = {

      temperature: parseFloat(formData.temperature),

      humidity: parseFloat(formData.humidity),

      aqi: parseFloat(formData.aqi),

      gas: parseFloat(formData.gas),

      motion: formData.motion === 'true',

    };

    const success = saveSensorData(sensorData);

    if (success) {

      setSuccessMessage('Sensor data saved successfully!');

      setFormData({

        temperature: '',
        humidity: '',
        aqi: '',
        gas: '',
        motion: 'false',

      });

      loadSensorHistory();

      setTimeout(() => setSuccessMessage(''), 3000);

    }

  };


  // ===============================
  // NORMAL DATA GENERATOR
  // ===============================

  const generateNormalData = () => {

    const data = {

      temperature: +(Math.random() * (35 - 20) + 20).toFixed(1),

      humidity: +(Math.random() * (70 - 40) + 40).toFixed(1),

      aqi: Math.floor(Math.random() * (150 - 50) + 50),

      gas: Math.floor(Math.random() * (300 - 100) + 100),

      motion: Math.random() > 0.7,

    };

    saveSensorData(data);

    loadSensorHistory();

  };


  // ===============================
  // HAZARD DATA GENERATOR
  // ===============================

  const generateHazardData = () => {

    const data = {

      temperature: +(Math.random() * (60 - 45) + 45).toFixed(1),

      humidity: +(Math.random() * (95 - 85) + 85).toFixed(1),

      aqi: Math.floor(Math.random() * (400 - 250) + 250),

      gas: Math.floor(Math.random() * (800 - 500) + 500),

      motion: true,

    };

    saveSensorData(data);

    loadSensorHistory();

  };


  // ===============================
  // AUTO MODE TOGGLE
  // ===============================

  const toggleAutoMode = () => {

    if (!autoMode) {

      const normal = setInterval(generateNormalData, 5000);

      const hazard = setInterval(generateHazardData, 30000);

      setAutoInterval(normal);

      setHazardInterval(hazard);

      setAutoMode(true);

      setSuccessMessage('Auto Mode Enabled');

    }

    else {

      clearInterval(autoInterval);

      clearInterval(hazardInterval);

      setAutoMode(false);

      setSuccessMessage('Auto Mode Disabled');

    }

    setTimeout(() => setSuccessMessage(''), 3000);

  };


  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {

    logout();

    navigate('/admin');

  };


  // ===============================
  // CLIENT DASHBOARD
  // ===============================

  const goToDashboard = () => {

    navigate('/dashboard');

  };


  // ===============================
  // UI
  // ===============================

  return (

    <div className="min-h-screen bg-gray-50">


      {/* NAVBAR */}


      <nav className="bg-white shadow-md border-b">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center h-16">


            <div className="flex items-center gap-2">

              <Activity className="w-8 h-8 text-blue-600"/>

              <h1 className="text-xl font-bold">

                Admin Dashboard

              </h1>

            </div>


            <div className="flex gap-3">


              {/* AUTO MODE BUTTON */}


              <button

                onClick={toggleAutoMode}

                className={`px-4 py-2 text-white rounded-lg

                ${autoMode

                  ? 'bg-yellow-600'

                  : 'bg-blue-600'

                }`}

              >

                {autoMode

                  ? 'Stop Auto Mode'

                  : 'Start Auto Mode'}

              </button>


              <button

                onClick={goToDashboard}

                className="px-4 py-2 bg-green-600 text-white rounded-lg"

              >

                View Client Dashboard

              </button>


              <button

                onClick={handleLogout}

                className="px-4 py-2 bg-red-600 text-white rounded-lg"

              >

                Logout

              </button>


            </div>

          </div>

        </div>

      </nav>


      {/* CONTENT */}


      <div className="max-w-7xl mx-auto p-8 grid lg:grid-cols-2 gap-8">


        {/* FORM */}


        <div className="bg-white p-6 rounded-xl shadow">


          <h2 className="text-2xl font-bold mb-4">

            Add Sensor Data

          </h2>


          {successMessage && (

            <div className="bg-green-100 p-3 mb-4">

              {successMessage}

            </div>

          )}


          <form onSubmit={handleSubmit} className="space-y-4">


            <input

              name="temperature"

              value={formData.temperature}

              onChange={handleInputChange}

              placeholder="Temperature"

              required

              className="w-full border p-2"

            />


            <input

              name="humidity"

              value={formData.humidity}

              onChange={handleInputChange}

              placeholder="Humidity"

              required

              className="w-full border p-2"

            />


            <input

              name="aqi"

              value={formData.aqi}

              onChange={handleInputChange}

              placeholder="AQI"

              required

              className="w-full border p-2"

            />


            <input

              name="gas"

              value={formData.gas}

              onChange={handleInputChange}

              placeholder="Gas"

              required

              className="w-full border p-2"

            />


            <select

              name="motion"

              value={formData.motion}

              onChange={handleInputChange}

              className="w-full border p-2"

            >

              <option value="false">No Motion</option>

              <option value="true">Motion</option>

            </select>


            <button

              className="w-full bg-blue-600 text-white p-2 rounded"

            >

              Submit

            </button>


          </form>


        </div>


        {/* HISTORY */}


        <div className="bg-white p-6 rounded-xl shadow">


          <h2 className="text-2xl font-bold mb-4">

            Sensor History

          </h2>


          <div className="max-h-[600px] overflow-y-auto">


            {sensorHistory.map(entry => (


              <div key={entry.id} className="border-b p-2">


                {new Date(entry.timestamp).toLocaleString()}


                <br/>


                Temp: {entry.temperature}

                Hum: {entry.humidity}

                AQI: {entry.aqi}

                Gas: {entry.gas}


              </div>


            ))}


          </div>


        </div>


      </div>


    </div>

  );

};


export default AdminDashboard;