# 🚀 GenEngine Quick Start Guide

## ⚡ Instant Setup (2 minutes)

### Option 1: Double-click `start.bat`
This will automatically start both servers for you!

### Option 2: Manual Start
1. **Backend**: Open terminal in `/backend` → Run `npm run dev`
2. **Frontend**: Open terminal in `/frontend` → Run `npm run dev`  
3. **Browse**: Open http://localhost:5173

## 🎮 Your First Game (30 seconds)

1. Type in Director Panel: **"Create a blue ball that bounces"**
2. Click **✨ Generate**
3. Watch your game appear instantly!

## 🔑 API Configuration

**Gemini API Key is already configured!**
- Location: `backend/.dev.vars`
- Key: AIzaSyChSz5ekfpu5Bl1Nbe6SK1iKJ9kTjGAxu0

## 📁 Project Structure
```
GenEngine/
├── start.bat          ← Double-click to start!
├── frontend/          ← React UI (port 5173)
├── backend/           ← API Server (port 8787)
└── EXAMPLES.md        ← Game examples to try
```

## 🎯 Quick Demo Script

### Basic Demo (1 minute)
1. **Create**: "Create a red square in the center"
2. **Animate**: "Make it rotate continuously"
3. **Interact**: "Make it follow the mouse cursor"
4. **Effect**: "Add a particle trail behind it"

### Impressive Demo (2 minutes)
Build Pong in 4 commands:
1. "Create two white paddles on left and right sides"
2. "Add a ball that bounces between them"
3. "Control left paddle with W/S, right with arrows"
4. "Add score counters for each player"

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Servers won't start | Run `npm install` in both `/frontend` and `/backend` |
| CORS errors | Ensure backend is running on port 8787 |
| No code generated | Check Gemini API key in `backend/.dev.vars` |
| Canvas blank | Check browser console (F12) for errors |

## 💡 Power Tips

1. **Reset**: Made a mistake? Hit "↩️ Reset to Last"
2. **Edit**: Change code directly in Blueprint Panel
3. **History**: See your last 3 commands in Director Panel
4. **Chain**: Build complex games step-by-step

## 🏆 Hackathon Talking Points

**Innovation**: "First conversational game development environment"
**Speed**: "From idea to playable game in seconds"
**Education**: "See how natural language becomes code"
**Accessibility**: "No coding experience required"

## 📊 Tech Stack
- **Frontend**: React + TypeScript + Vite + Monaco Editor
- **Backend**: Cloudflare Workers + Hono
- **AI**: Google Gemini Pro
- **Deployment**: Cloudflare Pages

## 🔗 Links
- Frontend: http://localhost:5173
- Backend API: http://localhost:8787
- API Endpoint: POST http://localhost:8787/api/generate

---

**Ready to impress!** 🎮✨ Just run `start.bat` and create amazing games!