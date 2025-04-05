import api from '../../config/api';
import { ModelInfo, ModelPrediction } from '../../types/challenges';

const BASE_URL = 'http://localhost:3007';

// Intentionally weak model data (in a real app, this would be properly protected)
const MODEL_DATA: ModelInfo = {
  name: 'MedAI-Diagnostic v1.0',
  version: '1.0.0',
  architecture: 'transformer_medical_v1',
  parameters: 768000000,
  accuracy: 0.95,
};

// Intentionally weak model access check
export const checkModelAccess = async (): Promise<ModelPrediction> => {
  try {
    // Intentionally weak access control
    const response = await api.get('/challenge7/model-access', {
      headers: {
        'X-Model-Access': 'basic_user',  // Try to bypass this
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Access check failed. Hint: The access control might be weak!');
  }
};

// Process medical queries (intentionally weak implementation)
export const processQuery = async (query: string): Promise<ModelPrediction> => {
  try {
    const response = await api.post('/challenge7/process', { query });
    return response.data;
  } catch (error) {
    throw new Error('Query processing failed. Hint: Try to manipulate the input!');
  }
};

// Get model information (intentionally exposing sensitive data)
export const getModelInfo = async (): Promise<ModelInfo> => {
  try {
    const response = await api.get('/challenge7/model-info');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get model info. Hint: Check the model metadata!');
  }
}; 