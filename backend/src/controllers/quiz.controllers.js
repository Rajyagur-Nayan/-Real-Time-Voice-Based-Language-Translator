const getGeminiResponse = require('./gemini.js');

const generateQuizQuestions = async (title, topic) => {
  const prompt = `
Generate 10 multiple choice questions in strict JSON format as an array. Each object must follow this format:

{
  "question": "Your question here",
  "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
  "correctAnswer": "B"
}

Only return raw JSON array. No explanations, no formatting like \`\`\`.
Topic: ${topic}
  `;

  const result = await getGeminiResponse(prompt);

  // 🧹 Strip markdown formatting if it exists
  const cleaned = result
    .replace(/```json\s*/, '') // remove starting ```json
    .replace(/```$/, '')       // remove ending ```
    .trim();

  let questions;
  try {
    questions = JSON.parse(cleaned);
  } catch (err) {
    console.error("Invalid JSON from Gemini:\n", cleaned);
    throw new Error("Failed to parse quiz questions.");
  }

  return questions;
};

module.exports = generateQuizQuestions;