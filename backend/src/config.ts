// GenEngine Configuration
export const config = {
  // Gemini Model Configuration
  gemini: {
    // Available models (as of late 2024):
    // - 'gemini-1.5-flash': Fast, reliable for code generation (RECOMMENDED)
    // - 'gemini-1.5-flash-8b': Smaller, faster variant
    // - 'gemini-1.5-pro': More capable but requires special API access
    // - 'gemini-pro': Legacy model (being phased out)
    // 
    // Note: Gemini 2.0/2.5 models are not yet available via public API
    model: 'gemini-1.5-flash',
    
    // Alternative models to try if you have access
    alternativeModels: [
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro-002', 
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-002'
    ]
  },
  
  // Generation settings
  generation: {
    temperature: 0.7,  // Creativity level (0.0 - 1.0)
    maxTokens: 4000,   // Maximum response length
  }
};