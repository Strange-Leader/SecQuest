import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { fetch } from '@tensorflow/tfjs-react-native';
import { decode } from 'base-64';

// Load tokenizer JSON file
import tokenizerData from '../assets/models/tokenizer.json';

// Function to tokenize text
const tokenizeText = (text) => {
    const tokenizer = JSON.parse(JSON.stringify(tokenizerData));
    const words = text.toLowerCase().split(' ');
    return words.map((word) => tokenizer.word_index[word] || 0);
};

// Load AI Model
const loadModel = async () => {
    await tf.ready();
    const modelJson = await fetch(require('../assets/models/simple_qa_model.tflite'), {
        isBinary: true
    });
    return await tf.loadGraphModel(modelJson);
};

// Function to ask a question to the AI model
const askAI = async (question) => {
    const model = await loadModel();
    const tokenizedInput = tokenizeText(question);

    // Convert to tensor format for the AI model
    const inputTensor = tf.tensor2d([tokenizedInput], [1, tokenizedInput.length]);

    // Get AI response
    const prediction = model.predict(inputTensor);
    const outputData = prediction.dataSync();
    
    return outputData;  // Return the model's response
};

export { askAI };
