# 🤖 Gemini Model Configuration

## Current Model: `gemini-1.5-flash`

GenEngine is configured to use the most reliable Gemini model for code generation.

## 📊 Available Gemini Models (as of 2024)

| Model | Status | Description | Best For |
|-------|--------|-------------|----------|
| **gemini-1.5-flash** | ✅ Active (DEFAULT) | Fast, reliable code generation | General use, hackathons |
| gemini-1.5-flash-8b | ✅ Available | Smaller, faster variant | Quick responses |
| gemini-1.5-flash-latest | ✅ Available | Latest flash variant | Latest features |
| gemini-1.5-pro | ⚠️ Limited Access | More capable, slower | Complex logic |
| gemini-1.5-pro-latest | ⚠️ Limited Access | Latest pro variant | Advanced features |
| gemini-pro | ❌ Deprecated | Legacy model | Not recommended |
| gemini-2.0-* | ❌ Not Available | Future models | Not yet released |
| gemini-2.5-* | ❌ Not Available | Future models | Not yet released |

## 🔧 How to Change Models

1. Edit `backend/src/config.ts`
2. Change the `model` field:
   ```typescript
   gemini: {
     model: 'gemini-1.5-flash',  // Change this line
   }
   ```
3. Restart the backend server

## 🎯 Model Recommendations

### For Hackathon Demo (Current)
✅ **Use: `gemini-1.5-flash`**
- Fast response times
- Reliable code generation
- No special API access needed
- Perfect balance of speed and quality

### For Production (Future)
⏳ **Consider: `gemini-1.5-pro`** (when available)
- Better reasoning capabilities
- More complex code understanding
- Requires API upgrade

### For Speed Priority
⚡ **Try: `gemini-1.5-flash-8b`**
- Fastest responses
- Good for simple prompts
- Lower token costs

## 📝 Important Notes

1. **Gemini 2.0/2.5 models** are not yet available through the public API
2. **Pro models** may require:
   - Upgraded API access
   - Higher rate limits
   - Additional billing setup
3. **Flash models** are optimized for:
   - Code generation
   - Fast responses
   - Consistent results

## 🔍 Testing Different Models

To test a different model:

```powershell
# 1. Stop servers
Get-Process | Where-Object {$_.ProcessName -like "node*"} | Stop-Process -Force

# 2. Edit backend/src/config.ts

# 3. Start servers
.\start.bat

# 4. Test API
.\test-api.ps1
```

## 📊 Performance Comparison

| Metric | gemini-1.5-flash | gemini-1.5-pro | gemini-1.5-flash-8b |
|--------|------------------|----------------|---------------------|
| Speed | Fast (~2-3s) | Slower (~4-6s) | Fastest (~1-2s) |
| Quality | High | Highest | Good |
| Reliability | Excellent | Good | Excellent |
| Code Complexity | Good | Excellent | Basic-Medium |
| API Access | Standard | Premium | Standard |

## 🚀 Future Updates

When new models become available:
1. Check [Google AI Studio](https://makersuite.google.com/) for announcements
2. Update `config.ts` with new model names
3. Test thoroughly before demos

## 💡 Current Configuration

```typescript
// backend/src/config.ts
export const config = {
  gemini: {
    model: 'gemini-1.5-flash',  // Current model
    // Alternative models available in config file
  },
  generation: {
    temperature: 0.7,  // Balance between creativity and consistency
    maxTokens: 4000,   // Sufficient for most game code
  }
};
```

---

**Note**: The `gemini-1.5-flash` model is currently the best choice for GenEngine as it provides the optimal balance of speed, reliability, and code generation quality for game development tasks.