import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Thermometer, Droplets, Wind, Gauge, Activity, Plus, Eye } from 'lucide-react';
import { saveSensorData, getSensorData, getLoginState, logout } from '../utils/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    aqi: '',
    gas: '',
    motion: 'false',
  });
  const [sensorHistory, setSensorHistory] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loginState = getLoginState();
    if (!loginState.isLoggedIn) {
      navigate('/admin');
    } else {
      loadSensorHistory();
    }
  }, [navigate]);

  const loadSensorHistory = () => {
    const data = getSensorData();
    setSensorHistory(data.reverse());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={goToDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Client Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Add Sensor Data</h2>
            </div>

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., 25.5"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., 65"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Wind className="w-4 h-4 text-green-500" />
                  Air Quality Index (AQI)
                </label>
                <input
                  type="number"
                  name="aqi"
                  value={formData.aqi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., 120"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="w-4 h-4 text-orange-500" />
                  Gas Level (ppm)
                </label>
                <input
                  type="number"
                  name="gas"
                  value={formData.gas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., 200"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Motion Detected
                </label>
                <select
                  name="motion"
                  value={formData.motion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
              >
                Submit Sensor Data
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sensor History</h2>

            {sensorHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sensor data recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Temp</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Hum</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">AQI</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Gas</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Motion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sensorHistory.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">{entry.temperature}°C</td>
                          <td className="px-4 py-3">{entry.humidity}%</td>
                          <td className="px-4 py-3">{entry.aqi}</td>
                          <td className="px-4 py-3">{entry.gas}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.motion
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {entry.motion ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
