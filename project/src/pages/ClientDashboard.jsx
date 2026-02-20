import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const latest = getLatestSensorData();
    const history = getSensorData();
    setLatestData(latest);
    setSensorHistory(history);
  };

  const handleGenerateExplanation = async () => {
    if (!latestData) {
      setError('No sensor data available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generateExplanation(latestData);
      setExplanation(result);
    } catch (err) {
      setError(err.message || 'Failed to generate explanation. Please check your API key.');
      console.error('Error generating explanation:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">IoT Smart System Dashboard</h1>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
              <button
                onClick={goToAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
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
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <Activity className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">
              Please add sensor data from the admin dashboard to get started.
            </p>
            <button
              onClick={goToAdmin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go to Admin Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Sensor Readings</h2>
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
                  color={latestData.motion ? 'green' : 'blue'}
                />
              </div>
            </div>

            {sensorHistory.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sensor Trends</h2>
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
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Latest Reading Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(latestData.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium text-gray-800">{latestData.temperature}°C</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-medium text-gray-800">{latestData.humidity}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Air Quality Index:</span>
                  <span className="font-medium text-gray-800">{latestData.aqi}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Gas Level:</span>
                  <span className="font-medium text-gray-800">{latestData.gas} ppm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Motion Status:</span>
                  <span className="font-medium text-gray-800">
                    {latestData.motion ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
