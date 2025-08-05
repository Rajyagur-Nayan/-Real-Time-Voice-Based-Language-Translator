const generatePrompt = (role, languages, description) => {
  return `
You are an expert tech roadmap advisor.

Based on the role: "${role}"
And using these technologies: [${languages.join(', ')}]
With the description: "${description}"

Create a learning roadmap consisting of 5 to 7 concise and essential topics.

Reply as an array of JSON objects, each with:
- "title": a short roadmap step or skill
- "detail": a brief 7–8 word explanation of what to learn

Only return the JSON array. No extra explanation or formatting.
`.trim();
};


module.exports = generatePrompt;
