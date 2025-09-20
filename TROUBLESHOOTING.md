# 🔧 GenEngine Troubleshooting Guide

## ✅ FIXED: API Connection Issue

### Problem
The Gemini API was returning 500 errors when trying to generate code.

### Solution Applied
1. Updated Gemini model from `gemini-pro` to `gemini-1.5-flash`
2. Fixed API endpoint URL construction in frontend
3. Verified API key configuration

## 🎉 Current Status: WORKING!

Both servers are running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8787

## 🚀 How to Start GenEngine

### Quick Start (Recommended)
```powershell
# From GenEngine root directory
.\start.bat
```

### Manual Start
1. **Terminal 1 - Backend**:
   ```powershell
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. Open browser to: http://localhost:5173

## 🧪 Test the API Directly
```powershell
.\test-api.ps1
```

## 📝 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution**: 
- Ensure backend is running on port 8787
- Check `.env.local` file exists in frontend directory
- Verify CORS is enabled in backend

### Issue: "500 Internal Server Error from API"
**Solution**:
- Check Gemini API key in `backend/.dev.vars`
- Ensure using model: `gemini-1.5-flash`
- Check console output in backend terminal for specific errors

### Issue: "Canvas not updating"
**Solution**:
- Open browser console (F12) to check for JavaScript errors
- Ensure generated code uses `document.getElementById('gameCanvas')`
- Try a simpler prompt first

### Issue: "Servers won't start"
**Solution**:
```powershell
# Kill all Node processes
Get-Process | Where-Object {$_.ProcessName -like "node*"} | Stop-Process -Force

# Reinstall dependencies
cd backend
npm install
cd ../frontend
npm install
```

## 🔑 Key Configuration Files

1. **Backend API Key**: `backend/.dev.vars`
   ```
   GEMINI_API_KEY=AIzaSyChSz5ekfpu5Bl1Nbe6SK1iKJ9kTjGAxu0
   ```

2. **Frontend API URL**: `frontend/.env.local`
   ```
   VITE_API_URL=http://localhost:8787
   ```

3. **Gemini Model**: `backend/src/index.ts` (line 39)
   ```typescript
   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
   ```

## 🎮 Working Test Prompts

Try these prompts that are confirmed to work:

1. **"Create a red ball in the center of the canvas"**
   - Creates a simple red circle

2. **"Make the ball bounce up and down"**
   - Adds physics and animation

3. **"Add arrow key controls to move the ball"**
   - Adds keyboard interaction

4. **"Make the ball change color when spacebar is pressed"**
   - Adds more interactivity

## 📊 System Requirements

- Node.js v20.17.0 or higher
- npm 10.8.2 or higher
- Windows PowerShell 5.1 or higher
- Modern web browser (Chrome, Firefox, Edge)

## 🆘 Emergency Reset

If everything breaks:
```powershell
# Stop all processes
Get-Process | Where-Object {$_.ProcessName -like "node*"} | Stop-Process -Force

# Clear npm cache
npm cache clean --force

# Reinstall everything
cd backend
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install

cd ../frontend
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install

# Start fresh
cd ..
.\start.bat
```

## 📞 Support

For hackathon support:
1. Check this troubleshooting guide
2. Review EXAMPLES.md for working prompts
3. Check browser console for errors
4. Verify all configuration files are in place

---

**Last Updated**: Fixed Gemini model issue - Now using `gemini-1.5-flash`
**Status**: ✅ FULLY OPERATIONAL