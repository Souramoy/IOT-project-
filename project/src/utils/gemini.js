const GEMINI_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const generateExplanation = async (sensorData) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const prompt = `As an IoT system analyst, analyze the following sensor readings and provide a detailed explanation:

Temperature: ${sensorData.temperature}°C
Humidity: ${sensorData.humidity}%
Air Quality Index (AQI): ${sensorData.aqi}
Gas Level: ${sensorData.gas} ppm
Motion Detected: ${sensorData.motion ? 'Yes' : 'No'}

Please explain:
1. What these sensor values indicate about the current environment
2. Possible reasons for these readings
3. Environmental factors that could have caused these values
4. Any recommendations or concerns based on these readings

Provide a comprehensive yet concise explanation suitable for a smart home monitoring system.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate explanation');
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content;

    if (!explanation) {
      throw new Error('No explanation generated');
    }

    return explanation;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
