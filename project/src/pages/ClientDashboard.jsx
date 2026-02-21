import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Droplets, Wind, Gauge, Activity, RefreshCw, Shield } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import ChartComponent from '../components/ChartComponent';
import ExplanationCard from '../components/ExplanationCard';
import { getSensorData, getLatestSensorData } from '../utils/storage';
import { generateExplanation } from '../utils/gemini';

const ClientDashboard = () => {

  const navigate = useNavigate();

  const [latestData, setLatestData] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);

  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hazard, setHazard] = useState(false);
  const [hazardMessage, setHazardMessage] = useState('');

  const lastHazardTimestamp = useRef(null);



  // AUTO REFRESH EVERY 5 SEC
  useEffect(() => {

    loadData();

    const interval = setInterval(() => {

      loadData();

    }, 5000);

    return () => clearInterval(interval);

  }, []);



  // LOAD DATA
  const loadData = () => {

    const latest = getLatestSensorData();
    const history = getSensorData();

    setLatestData(latest);
    setSensorHistory(history);

    checkHazard(latest, history);

  };



  // HAZARD CHECK
  const checkHazard = async (latest, history) => {

    if (!latest) return;

    const isHazard =

      latest.temperature > 45 ||
      latest.temperature < 5 ||
      latest.humidity > 90 ||
      latest.humidity < 20 ||
      latest.gas > 900 ||
      latest.aqi > 300;

    if (!isHazard) return;

    if (lastHazardTimestamp.current === latest.timestamp) return;

    lastHazardTimestamp.current = latest.timestamp;

    setHazard(true);

    setLoading(true);

    try {

      const last10 = history.slice(-10);

      const result = await generateExplanation(last10);

      setHazardMessage(result);

      setExplanation(result);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  };



  // USER BUTTON GENERATE
const handleGenerateExplanation = async () => {

  console.log("BUTTON CLICKED");

  if (!sensorHistory || sensorHistory.length === 0) {

    console.log("NO DATA");

    setError("No data");

    return;

  }

  try {

    setLoading(true);

    const last10 = sensorHistory.slice(-10);

    console.log("SENDING DATA:", last10);

    const result = await generateExplanation(last10);

    console.log("RESULT:", result);

    setExplanation(result);

  }

  catch (err) {

    console.log("ERROR:", err);

    setError(err.message);

  }

  finally {

    setLoading(false);

  }

};



  const goToAdmin = () => {

    navigate('/admin');

  };



  const closeHazard = () => {

    setHazard(false);

  };



  return (

<div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${hazard ? "animate-pulse bg-red-200" : ""}`}>





{/* HAZARD POPUP */}


{hazard && (

<div className="fixed inset-0 flex items-center justify-center z-50">

<div className="bg-white p-8 rounded-lg shadow-xl border-4 border-red-600 max-w-md">

<h2 className="text-2xl font-bold text-red-600 mb-4">

⚠ HAZARD DETECTED

</h2>


<p className="mb-4 text-gray-800">

{hazardMessage}

</p>


<button

onClick={closeHazard}

className="bg-red-600 text-white px-4 py-2 rounded"

>

Close

</button>


</div>

</div>

)}





<nav className="bg-white shadow-md border-b border-gray-200">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="flex justify-between items-center h-16">

<div className="flex items-center gap-2">

<Activity className="w-8 h-8 text-blue-600" />

<h1 className="text-xl font-bold text-gray-800">

IoT Smart System Dashboard

</h1>

</div>



<div className="flex gap-3 items-center">

<button

onClick={loadData}

className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"

>

<RefreshCw className="w-4 h-4" />

Refresh Data

</button>



<button

onClick={goToAdmin}

className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"

>

<Shield className="w-4 h-4" />

Admin Panel

</button>

</div>

</div>

</div>

</nav>





<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">





{!latestData ? (

<div>No Data</div>

) : (

<div className="space-y-8">





<div>

<h2 className="text-2xl font-bold text-gray-800 mb-4">

Current Sensor Readings

</h2>



<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">



<SensorCard

title="Temperature"

value={latestData.temperature}

unit="°C"

icon={Thermometer}

color="red"

/>



<SensorCard

title="Humidity"

value={latestData.humidity}

unit="%"

icon={Droplets}

color="blue"

/>



<SensorCard

title="Air Quality"

value={latestData.aqi}

unit="AQI"

icon={Wind}

color="green"

/>



<SensorCard

title="Gas Level"

value={latestData.gas}

unit="ppm"

icon={Gauge}

color="orange"

/>



<SensorCard

title="Motion"

value={latestData.motion ? 'Detected' : 'None'}

icon={Activity}

color="green"

/>

</div>

</div>





{sensorHistory.length > 1 && (

<div>

<h2 className="text-2xl font-bold text-gray-800 mb-4">

Sensor Trends

</h2>



<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">



<ChartComponent

data={sensorHistory}

dataKey="temperature"

title="Temperature Over Time"

color="#ef4444"

yAxisLabel="Temperature (°C)"

/>



<ChartComponent

data={sensorHistory}

dataKey="humidity"

title="Humidity Over Time"

color="#3b82f6"

yAxisLabel="Humidity (%)"

/>



<ChartComponent

data={sensorHistory}

dataKey="aqi"

title="Air Quality Index Over Time"

color="#22c55e"

yAxisLabel="AQI"

/>



<ChartComponent

data={sensorHistory}

dataKey="gas"

title="Gas Level Over Time"

color="#f97316"

yAxisLabel="Gas (ppm)"

/>

</div>

</div>

)}





<div>

<ExplanationCard

explanation={explanation}

loading={loading}

onGenerate={handleGenerateExplanation}

hasData={!!latestData}

/>



{error && (

<div className="text-red-600 mt-2">

{error}

</div>

)}

</div>





</div>

)}



</div>

</div>

);

};

export default ClientDashboard;