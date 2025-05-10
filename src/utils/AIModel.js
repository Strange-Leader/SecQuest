// Mock AI Model implementation
const askAI = async (question) => {
    // Mock response instead of loading the model
    console.log('AI feature temporarily disabled. Question received:', question);
    return [0];  // Return a simple mock response
};

export { askAI };
