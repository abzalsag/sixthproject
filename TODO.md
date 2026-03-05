# Deployment Plan - SixthProject

## Орындалған:
- [x] railway.json түзету - dockerfilePath -> "backend/Dockerfile"

## Қалған қадамдар:

### 1. GitHub репозиторийін құру
```
bash
cd SixthProject
git init
git add .
git commit -m "Initial commit"
# GitHub-та жаңа репозиторий құрып, оған қосылыңыз
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. Railway-ге деплойлау
1. https://railway.app -> New Project -> Deploy from GitHub
2. SixthProject репозиторийін таңдаңыз
3. Railway автоматты түрде railway.json табады
4. "Deploy" басыңыз

### 3. Railway Environment Variables
Деплойдан кейін келесі айнымалыларды қосыңыз:
- `SPRING_PROFILES_ACTIVE` = `prod`
- `CORS_ORIGINS` = `https://your-project.vercel.app` (Vercel URL)
- `FIREBASE_SERVICE_ACCOUNT_JSON` = `{firebase_config}`

### 4. Vercel-ге деплойлау
1. https://vercel.com -> New Project -> GitHub
2. SixthProject репозиторийін таңдаңыз
3. Framework Preset: Vite
4. Build Command: npm run build
5. Output Directory: dist
6. Environment Variables:
   - `VITE_API_URL` = `https://your-railway-app.railway.app`

### 5. CORS жаңарту
Railway деплойдан кейін:
- Railway environment variables: `CORS_ORIGINS` = `https://your-vercel-app.vercel.app`
