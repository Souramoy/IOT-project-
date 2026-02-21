const GEMINI_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateExplanation = async (history) => {

  console.log("GEMINI FUNCTION CALLED");

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) return "API key missing";

  if (!history || history.length < 2) return "Not enough data";



  // =========================
  // Prepare data
  // =========================

  const latest = history[history.length - 1];

  const previous = history.slice(-10, -1);



  const avg = (key) =>
    previous.reduce((sum, item) => sum + item[key], 0) / previous.length;



  const avgTemp = avg("temperature");
  const avgHumidity = avg("humidity");
  const avgAqi = avg("aqi");
  const avgGas = avg("gas");



  const diffTemp = latest.temperature - avgTemp;
  const diffHumidity = latest.humidity - avgHumidity;
  const diffAqi = latest.aqi - avgAqi;
  const diffGas = latest.gas - avgGas;



  // =========================
  // AI Prompt
  // =========================

  const prompt = `

You are an IoT sensor analyst.

Analyze ONLY this sensor data.

Do NOT assume anything.

Do NOT imagine anything.

Use ONLY numbers given.



Previous Average:

Temperature: ${avgTemp.toFixed(1)} °C
Humidity: ${avgHumidity.toFixed(1)} %
AQI: ${avgAqi.toFixed(0)}
Gas: ${avgGas.toFixed(0)} ppm



Latest Reading:

Temperature: ${latest.temperature} °C
Humidity: ${latest.humidity} %
AQI: ${latest.aqi}
Gas: ${latest.gas} ppm
Motion: ${latest.motion ? "Detected" : "Not detected"}



Change:

Temperature change: ${diffTemp.toFixed(1)} °C
Humidity change: ${diffHumidity.toFixed(1)} %
AQI change: ${diffAqi.toFixed(0)}
Gas change: ${diffGas.toFixed(0)}



Rules:

• Explain ONLY based on data

• Say exact problem

• Say exact action

• Maximum 2 lines

• Very simple human language



Examples:

Room hotter than usual → Turn on fan.

Room colder than usual → Close window.

Gas higher than usual → Open window.

AQI higher than usual → Improve ventilation.

Motion detected → Someone is in room.



Now generate explanation.

`;



  console.log("PROMPT:", prompt);



  try {

    // =========================
    // API Call
    // =========================

    const response = await fetch(GEMINI_API_URL, {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${apiKey}`,

      },

      body: JSON.stringify({

        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,

        max_tokens: 100,

      }),

    });



    const data = await response.json();

    console.log("API RESPONSE:", data);



    // =========================
    // FIXED RESPONSE EXTRACTION
    // =========================

    let text = "";



    if (data?.choices?.[0]?.message?.content)
      text = data.choices[0].message.content;

    else if (data?.choices?.[0]?.text)
      text = data.choices[0].text;

    else if (data?.choices?.[0]?.delta?.content)
      text = data.choices[0].delta.content;



    text = text?.trim();



    console.log("FINAL AI TEXT:", text);



    if (!text)
      return "No AI response";



    return text;

  }

  catch (error) {

    console.error("AI ERROR:", error);

    return "Error generating explanation";

  }

};