import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';

type Bindings = {
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all origins during development
app.use('*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'GenEngine API',
    version: '1.0.0'
  });
});

// Main generation endpoint
app.post('/api/generate', async (c) => {
  try {
    const { currentCode, promptHistory, newPrompt } = await c.req.json();

    // Validate input
    if (!newPrompt || typeof newPrompt !== 'string') {
      return c.json({ error: 'Invalid prompt provided' }, 400);
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
    
    // Use configured model (defaults to gemini-1.5-flash)
    const modelName = config.gemini.model;
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: config.generation.temperature,
        maxOutputTokens: config.generation.maxTokens,
      }
    });
    console.log(`Using Gemini model: ${modelName}`);

    // Construct the system prompt
    const systemPrompt = `You are an expert game development assistant specialized in the HTML5 Canvas API. Your purpose is to iteratively build a game by modifying a single JavaScript file based on user prompts.

INPUT FORMAT: You will receive:
- currentCode: The existing JavaScript code (may be empty)
- promptHistory: Array of previous prompts for context
- newPrompt: The user's latest instruction

TASK: Modify the currentCode to implement the user's newPrompt, taking the promptHistory into account for context. You must generate code that is clean, efficient, and self-contained. The game loop should be handled with requestAnimationFrame.

OUTPUT FORMAT: You MUST ONLY output a valid JSON object containing exactly two keys:
- "newCode": a string with the complete, updated JavaScript code
- "explanation": a brief, 1-2 sentence description of the changes you made

CONSTRAINTS:
1. DO NOT use any external libraries or dependencies. Only use standard browser JavaScript and the HTML5 Canvas API.
2. If currentCode is empty, create the initial game structure: get the canvas context (assuming canvas id is 'gameCanvas'), create a game loop with requestAnimationFrame, and set up a basic state object.
3. Ensure the generated code is a single, complete script. Do not assume other files exist.
4. Refactor the code as you go for readability. For example, if adding player movement, encapsulate player-related variables into a player object.
5. All variables should be properly scoped within the script to avoid polluting the global namespace.
6. The canvas element will have id="gameCanvas" and will already exist in the DOM.
7. Always use 'const canvas = document.getElementById("gameCanvas")' to get the canvas reference.

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, explanations outside the JSON, or code blocks.`;

    // Build the user message
    let userMessage = systemPrompt + '\n\n';
    userMessage += `Current Code:\n${currentCode || '// No code yet'}\n\n`;
    userMessage += `Prompt History:\n${promptHistory.length > 0 ? promptHistory.join('\n') : 'None'}\n\n`;
    userMessage += `New Prompt:\n${newPrompt}`;

    // Generate the response
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response in case it has markdown formatting
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return c.json({ 
        error: 'Failed to parse AI response. Please try again.' 
      }, 500);
    }

    // Validate the response structure
    if (!parsedResponse.newCode || !parsedResponse.explanation) {
      return c.json({ 
        error: 'Invalid response structure from AI' 
      }, 500);
    }

    return c.json({
      newCode: parsedResponse.newCode,
      explanation: parsedResponse.explanation
    });

  } catch (error) {
    console.error('Generation error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An error occurred during generation' 
    }, 500);
  }
});

export default app;