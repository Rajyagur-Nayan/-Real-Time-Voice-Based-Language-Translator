function parseProjectIdeasResponse(reply) {
    const jsonStart = reply.indexOf('```json');
    const jsonEnd = reply.lastIndexOf('```');

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid format: JSON block not found");
    }

    const jsonString = reply.slice(jsonStart + 7, jsonEnd).trim();

    try {
        const ideas = JSON.parse(jsonString);
        return ideas.map(({ title, detail }) => ({
            title: title.trim(),
            detail: detail.trim()
        }));
    } catch (error) {
        console.error("JSON parsing error:", error);
        return [];
    }
}

module.exports = parseProjectIdeasResponse;