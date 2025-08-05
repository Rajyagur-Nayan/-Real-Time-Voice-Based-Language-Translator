// gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Send a prompt to Gemini and get the response.
 * @param {string} prompt - The input prompt for Gemini.
 * @returns {Promise<string>} - The generated response text.
 */
const getGeminiResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    throw new Error("Failed to get response from Gemini");
  }
};

module.exports = getGeminiResponse;
