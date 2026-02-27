# Қолданбаңызды деплойлау нұсқаулығы

## Бөлім 1: Бекенді Railway-ге деплойлау

### 1. Railway аккаунтын құру
1. https://railway.app сайтқа кіріңіз
2. "Sign Up" батырмасын басып аккаунт құрыңыз
3. Email арқылы аккаунтыңызды растаңыз

### 2. Жобаны импорттау
1. Railway Dashboard-та "New Project" батырмасын басыңыз
2. "Deploy from GitHub" опциясын таңдаңыз (GitHub аккаунтыңызды қосыңыз)
3. Жобаңызды GitHub-қа жіберіңіз (егер жіберілмеген болса):
   ```bash
   cd c:\Users\user\Desktop\SixthProject\SixthProject
   git init
   git add .
   git commit -m "Initial commit"
   # GitHub-та жаңа репозиторий құрып, оған қосылыңыз
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### 3. Бекенді деплойлау
1. Railway-де "Deploy from GitHub" арқылы жобаңызды таңдаңыз
2. Repository-дан `backend` папкасын таңдаңыз
3. Railway автоматты түрде `Dockerfile` және `railway.json` файлдарын табады
4. "Deploy" батырмасын басыңыз

### 4. PostgreSQL дерекқорын қосу
1. Dashboard-тан "New" → "Database" → "Provision PostgreSQL" таңдаңыз
2. Дерекқор қосылғаннан кейін, Environment Variables бөліміне келесілерді қосыңыз:
   - `DATABASE_URL` - автоматты түрде қосылады
   - `DB_USERNAME` - автоматты түрде қосылады
   - `DB_PASSWORD` - автоматты түрде қосылады
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `CORS_ORIGINS` = `https://your-frontend-domain.vercel.app` (фронтенд доменыңызды қойыңыз)

### 5. Firebase сервис есебін қосу
1. Environment Variables бөліміне келесі айнымалыны қосыңыз:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = `{"your_firebase_config_here"}` (сіздің Firebase конфигурацияңызды қойыңыз)

## Бөлім 2: Фронтенді Vercel-ге деплойлау

### 1. Vercel аккаунтын құру
1. https://vercel.com сайтқа кіріңіз
2. "Sign Up" батырмасын басып аккаунт құрыңыз
3. GitHub аккаунтыңызды қосыңыз

### 2. Фронтенді деплойлау
1. Vercel Dashboard-та "New Project" батырмасын басыңыз
2. GitHub репозиторийін таңдаңыз (жоғарыда құрған репозиторийіңізді)
3. Repository-дан `frontend` папкасын таңдаңыз
4. Бұл жерде Environment Variables бөлімінде келесі айнымалыны қосыңыз:
   - `VITE_API_URL` = `https://your-railway-backend-domain.railway.app` (Railway бекендіңіздің URL-ын қойыңыз)
5. "Deploy" батырмасын басыңыз

## Бөлім 3: Деплойланған қолданбаны сынау

1. Фронтенд URL-ын ашыңыз (Vercel сізге береді)
2. Кіру/тіркелу функцияларын сынаңыз
3. Ивенттер жасау, посттар жариялау және басқа функцияларды сынаңыз

## Маңызды ескертулер

- Бекендік `Dockerfile` және `railway.json` файлдары дайын күйде
- Фронтендік `vercel.json` файлы дайын күйде
- Деплойлау кезінде CORS параметрлерін дұрыс орнатуды ұмытпаңыз
- Барлық қажетті қызметтер (PostgreSQL, Redis, MinIO) Railway-де қолжетімді болатынын тексеріңіз

Егер қандай да бір қате шықса, оның сипаттамасын көшіріп беріңіз, содан кейін көмектесе аламын.