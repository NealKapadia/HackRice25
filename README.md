# 🎮 GenEngine

**A live, AI-powered game development environment. Instruct, play, and code your game into existence, all in one canvas.**

![Version](https://img.shields.io/badge/version-1.0-blue)
![Hackathon](https://img.shields.io/badge/Hackathon-MVP-green)

## 🌟 Overview

GenEngine is an interactive web application that revolutionizes game development through natural language instructions. With its intuitive three-panel interface, you can:

1. **Director Panel** - Enter natural language commands to describe your game
2. **Live Canvas** - See your game rendered and playable in real-time
3. **Blueprint Panel** - View and edit the AI-generated source code

The core loop is simple: **Instruct → Generate → Interact**

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.17.0 or higher)
- npm or yarn
- A Gemini API key from Google AI Studio
- Cloudflare account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/genengine.git
cd genengine
```

2. **Set up the Backend**
```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your GEMINI_API_KEY

# Start the backend development server
npm run dev
```

The backend will run on `http://localhost:8787`

3. **Set up the Frontend** (in a new terminal)
```bash
cd frontend

# Install dependencies  
npm install

# Create your environment file
cp .env.example .env.local
# The default settings should work for local development

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

1. Open your browser to `http://localhost:5173`
2. In the Director Panel, type a command like:
   - "Create a red bouncing ball"
   - "Add keyboard controls to move the ball"
   - "Make the ball leave a trail"
3. Click "Generate" and watch your game come to life!
4. Use "Reset to Last" to undo if needed
5. Edit the code directly in the Blueprint Panel for fine control

## 🏗️ Architecture

### Frontend (Vite + React + TypeScript)
- **Components**: Three main panels for user interaction
- **Monaco Editor**: VS Code's editor for code display
- **State Management**: React hooks for history and undo functionality

### Backend (Cloudflare Worker + Hono)
- **Edge Computing**: Low-latency API responses
- **Gemini Integration**: Google's AI for code generation
- **CORS Enabled**: Seamless frontend-backend communication

## 📦 Deployment

### Deploy Backend to Cloudflare Workers

```bash
cd backend

# Add your Gemini API key as a secret
wrangler secret put GEMINI_API_KEY
# Enter your API key when prompted

# Deploy to Cloudflare
npm run deploy
```

Note your Worker URL (e.g., `https://genengine-api.your-subdomain.workers.dev`)

### Deploy Frontend to Cloudflare Pages

```bash
cd frontend

# Update .env.production with your Worker URL
echo "VITE_API_URL=https://your-worker-url.workers.dev" > .env.production

# Build the frontend
npm run build

# Deploy using Cloudflare Pages
# 1. Go to Cloudflare Dashboard > Pages
# 2. Create a new project
# 3. Connect your GitHub repository
# 4. Set build command: npm run build
# 5. Set build directory: dist
```

## 🏆 Hackathon Tracks & Challenges

### Primary Track: Productivity & Education
- Enhances developer productivity through rapid prototyping
- Educational tool connecting natural language to code

### Sponsor Challenges:
- **Warp**: Best Developer Tool
- **MLH**: Best Use of Gemini API  
- **Cloudflare**: Best AI Application Built with Cloudflare
- **MLH**: Best Use of MongoDB Atlas (post-MVP)
- **MLH**: Best Use of Auth0 (post-MVP)
- **Ken Kennedy Institute**: Responsible AI
- **Persona**: Identity Verification (post-MVP)

## 📋 MVP Features

- [x] Natural language to code generation
- [x] Live canvas rendering
- [x] Code editor with syntax highlighting
- [x] Undo/Reset functionality
- [x] Prompt history
- [x] Manual code editing
- [x] Error handling and display

## 🔮 Post-Hackathon Roadmap

- [ ] User accounts and authentication (Auth0)
- [ ] Project persistence (MongoDB Atlas)
- [ ] Asset upload (images/audio)
- [ ] Multi-file project support
- [ ] Collaborative features
- [ ] Advanced code intelligence

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Make sure the backend is running and the API URL is correct in your `.env` file
2. **Canvas not updating**: Check the browser console for JavaScript errors
3. **API key issues**: Ensure your Gemini API key is properly set in `.dev.vars`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Cloudflare for edge infrastructure
- Monaco Editor for code editing
- The hackathon organizers and sponsors

---

Built with ❤️ during the hackathon. Happy coding! 🚀