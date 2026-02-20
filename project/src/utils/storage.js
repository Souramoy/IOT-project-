const SENSOR_DATA_KEY = 'iot_sensor_data';
const LOGIN_STATE_KEY = 'iot_login_state';

export const saveSensorData = (data) => {
  try {
    const existingData = getSensorData();
    const newEntry = {
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };
    const updatedData = [...existingData, newEntry];
    localStorage.setItem(SENSOR_DATA_KEY, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error saving sensor data:', error);
    return false;
  }
};

export const getSensorData = () => {
  try {
    const data = localStorage.getItem(SENSOR_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sensor data:', error);
    return [];
  }
};

export const getLatestSensorData = () => {
  const data = getSensorData();
  return data.length > 0 ? data[data.length - 1] : null;
};

export const saveLoginState = (isLoggedIn, username = '') => {
  try {
    const loginState = {
      isLoggedIn,
      username,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(loginState));
    return true;
  } catch (error) {
    console.error('Error saving login state:', error);
    return false;
  }
};

export const getLoginState = () => {
  try {
    const state = localStorage.getItem(LOGIN_STATE_KEY);
    return state ? JSON.parse(state) : { isLoggedIn: false, username: '' };
  } catch (error) {
    console.error('Error getting login state:', error);
    return { isLoggedIn: false, username: '' };
  }
};

export const logout = () => {
  saveLoginState(false, '');
};

export const clearAllData = () => {
  localStorage.removeItem(SENSOR_DATA_KEY);
  localStorage.removeItem(LOGIN_STATE_KEY);
};
