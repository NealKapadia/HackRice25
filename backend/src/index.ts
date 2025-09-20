import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenAI } from '@google/genai';
import { config } from './config';
import { geometryDashTemplate } from './gameTemplate';

type Bindings = {
  GEMINI_API_KEY: string;
  R2_BUCKET?: R2Bucket;
};

type GeneratedAsset = {
  type: 'image';
  name: string;
  url: string;
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
    const { currentCode, promptHistory, newPrompt, existingAssets = {} } = await c.req.json();

    // Validate input
    if (!newPrompt || typeof newPrompt !== 'string') {
      return c.json({ error: 'Invalid prompt provided' }, 400);
    }

    // Initialize GenAI with API key from environment
    const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY });
    
    console.log(`Using Gemini model: ${config.gemini.model}`);

    // Construct the enhanced system prompt for multimodal generation
    const systemPrompt = `You are an expert game development assistant specialized in the HTML5 Canvas API and multimodal asset generation. Your purpose is to iteratively build a game by modifying a single JavaScript file and generating necessary image assets based on user prompts.

INPUT FORMAT: You will receive:
- currentCode: The existing JavaScript code (may be empty)
- promptHistory: Array of previous prompts for context
- newPrompt: The user's latest instruction
- existingAssets: Object mapping asset names to their URLs

TASK: Modify the currentCode to implement the user's newPrompt. The existingAssets object shows you what image URLs are available - use these URLs in your code when loading images. If the prompt implies a new visual element or change that requires an image, you MUST indicate an image should be generated.

OUTPUT FORMAT: You MUST ONLY output a valid JSON object containing three keys:
- "newCode": a string with the complete, updated JavaScript code
- "explanation": a brief, 1-2 sentence description of the changes you made
- "imageGenerationPrompt": (optional) an object with "name" and "description" if a new image needs to be generated

CONSTRAINTS:
1. DO NOT use any external libraries or dependencies. Only use standard browser JavaScript and the HTML5 Canvas API.
2. If currentCode is empty, return it as-is (a Geometry Dash template is already provided).
3. Ensure the generated code is a single, complete script that can run independently.
4. When generating an imageGenerationPrompt, make the description specific (e.g., "A side-view 32x32 pixel art blue cube").
5. All variables should be properly scoped within the script.
6. The canvas element will have id="gameCanvas" and will already exist in the DOM.
7. IMPORTANT: Do NOT reference 'existingAssets' variable in the generated game code - it's only metadata for you to know what image URLs are available. Instead, hardcode the actual URLs from existingAssets when loading images in the code.

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting or code blocks.`;

    // Build the user message with existingAssets info
    // Use Geometry Dash template if no current code exists
    const initialCode = currentCode || geometryDashTemplate.trim();
    let userMessage = systemPrompt + '\n\n';
    userMessage += `Current Code:\n${initialCode}\n\n`;
    userMessage += `Existing Assets:\n${JSON.stringify(existingAssets)}\n\n`;
    userMessage += `Prompt History:\n${promptHistory.length > 0 ? promptHistory.join('\n') : 'None'}\n\n`;
    userMessage += `New Prompt:\n${newPrompt}`;

    // Generate the response using the new SDK
    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents: userMessage,
    });
    const text = response.text;

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

    // Handle image generation if requested
    let finalCode = parsedResponse.newCode;
    const generatedAssets: GeneratedAsset[] = [];
    
    if (parsedResponse.imageGenerationPrompt) {
      const { name, description } = parsedResponse.imageGenerationPrompt;
      
      try {
        console.log(`Generating image: ${name} - ${description}`);
        
        // Generate image using Imagen
        const imageResponse = await ai.models.generateImages({
          model: config.imagen.model,
          prompt: description,
          config: {
            ...config.imagen.defaultConfig,
            numberOfImages: 1,
          },
        });
        
        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
          const generatedImage = imageResponse.generatedImages[0];
          const imageBytes = generatedImage.image.imageBytes;
          
          // Convert base64 to Uint8Array
          const binaryString = atob(imageBytes);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Store image in R2 if bucket is available
          let imageUrl = `data:image/png;base64,${imageBytes}`; // Default to data URL
          
          if (c.env.R2_BUCKET) {
            const key = `assets/${name}_${Date.now()}.png`;
            await c.env.R2_BUCKET.put(key, bytes, {
              httpMetadata: {
                contentType: 'image/png',
              },
            });
            
            // Construct the public URL (you'll need to configure your R2 bucket for public access)
            imageUrl = `https://your-r2-domain.com/${key}`; // Replace with your actual R2 public domain
          }
          
          // Replace the placeholder URL in the code with the actual image URL
          finalCode = finalCode.replace(`'PENDING_${name}'`, `'${imageUrl}'`);
          finalCode = finalCode.replace(`"PENDING_${name}"`, `"${imageUrl}"`);
          
          generatedAssets.push({
            type: 'image',
            name: name,
            url: imageUrl,
          });
        }
      } catch (imageError) {
        console.error('Failed to generate image:', imageError);
        // Continue without the image - the game code should handle missing assets
        // Remove the pending placeholder if image generation failed
        finalCode = finalCode.replace(`'PENDING_${name}'`, 'null');
        finalCode = finalCode.replace(`"PENDING_${name}"`, 'null');
      }
    }

    return c.json({
      newCode: finalCode,
      explanation: parsedResponse.explanation,
      generatedAssets: generatedAssets
    });

  } catch (error) {
    console.error('Generation error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An error occurred during generation' 
    }, 500);
  }
});

export default app;