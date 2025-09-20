// GenEngine Configuration
export const config = {
  // Gemini Model Configuration
  gemini: {
    // Using Gemini 2.5 Flash for advanced code generation
    model: 'gemini-2.5-flash',
    
    // Alternative models to try if you have access
    alternativeModels: [
      'gemini-2.0-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest'
    ]
  },
  
  // Imagen Model Configuration for image generation
  imagen: {
    model: 'imagen-4.0-generate-001',
    defaultConfig: {
      numberOfImages: 1,
      aspectRatio: '1:1',
      safetyFilterLevel: 'block_some',
      personGeneration: 'dont_allow'
    }
  },
  
  // Generation settings
  generation: {
    temperature: 0.7,  // Creativity level (0.0 - 1.0)
    maxTokens: 4000,   // Maximum response length
  }
};