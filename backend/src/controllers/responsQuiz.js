function parseProjectIdeasResponse(responseText) {
    try {
        // Remove markdown formatting like ```json and ```
        const cleanText = responseText.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        throw new Error(`Failed to parse quiz JSON: ${error.message}`);
    }
}

module.exports = parseProjectIdeasResponse;
