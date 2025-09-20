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
- currentCode: The existing JavaScript code
- promptHistory: Array of previous prompts for context
- newPrompt: The user's latest instruction
- existingAssets: Object mapping asset names to their URLs

TASK: Modify the currentCode to implement the user's newPrompt. IMPORTANT: When the user asks for visual changes (like "make the player a dragon" or "change player to pixel art"), you MUST:
1. Generate a new image by providing imageGenerationPrompt
2. Update the code to load and use this image (use a placeholder URL like 'PENDING_playerSprite' that will be replaced)
3. Actually modify the rendering code to use the new sprite

OUTPUT FORMAT: You MUST ONLY output a valid JSON object containing three keys:
- "newCode": a string with the complete, updated JavaScript code
- "explanation": a brief, 1-2 sentence description of the changes you made
- "imageGenerationPrompt": an object with "name" and "description" when visual assets are needed

IMAGE GENERATION RULES:
- If the prompt mentions changing how something LOOKS (color, style, character, sprite, visual, pixel art, etc.), you MUST generate an image
- For "player" visual changes: name should be "playerSprite", description should match what user wants
- For "obstacle" visual changes: name should be "spikeSprite" or "platformSprite"
- For "background" changes: name should be "backgroundImage"
- Description should be specific: size (32x32 for sprites), style (pixel art, cartoon, etc), perspective (side-view for platformers)

CODE UPDATE RULES:
- When generating an image, update assetUrls object in the code with 'PENDING_[name]' as placeholder
- Modify the draw functions to actually use the sprites when available
- Keep fallback rendering (colored rectangles) for when images aren't loaded yet

EXAMPLE:
If user says "Make the player a pixel art dragon":
- imageGenerationPrompt: {"name": "playerSprite", "description": "A side-view 30x30 pixel art dragon character, green with wings, suitable for a platformer game"}
- Update code to set assetUrls.player = 'PENDING_playerSprite' and ensure draw function uses it

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
        
        // For now, use a placeholder image since Imagen API might not be available
        // TODO: Uncomment when Imagen API is properly configured
        /*
        const imageResponse = await ai.models.generateImages({
          model: config.imagen.model,
          prompt: description,
          config: {
            ...config.imagen.defaultConfig,
            numberOfImages: 1,
          },
        });
        */
        
        // Temporary: Generate a colorful placeholder SVG for testing
        // This simulates what would come from the Imagen API
        const svgColors = {
          playerSprite: '#4CAF50',
          spikeSprite: '#F44336',
          platformSprite: '#2196F3',
          backgroundImage: '#87CEEB'
        };
        
        const svgLabels = {
          playerSprite: '🐉',
          spikeSprite: '⚠',
          platformSprite: '▭',
          backgroundImage: '☁'
        };
        
        const color = svgColors[name] || '#9C27B0';
        const label = svgLabels[name] || '?';
        
        const svgString = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" fill="${color}" rx="4"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-family="Arial">${label}</text>
        </svg>`;
        
        // Create a proper base64-encoded data URL
        const base64Svg = btoa(svgString);
        
        // Simulate the Imagen API response structure
        const imageResponse = {
          generatedImages: [{
            image: {
              imageBytes: base64Svg
            }
          }]
        };
        
        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
          const generatedImage = imageResponse.generatedImages[0];
          const imageBytes = generatedImage.image.imageBytes;
          
          // For SVG placeholders, create the data URL directly
          // When using real Imagen API, this would be PNG data
          let imageUrl = `data:image/svg+xml;base64,${imageBytes}`;
          
          // Skip R2 upload for SVG placeholders
          // TODO: Re-enable when using real Imagen API
          /*
          if (c.env.R2_BUCKET) {
            const binaryString = atob(imageBytes);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            const key = `assets/${name}_${Date.now()}.png`;
            await c.env.R2_BUCKET.put(key, bytes, {
              httpMetadata: {
                contentType: 'image/png',
              },
            });
            
            imageUrl = `https://your-r2-domain.com/${key}`;
          }
          */
          
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