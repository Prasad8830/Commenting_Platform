# 🚀 Docker & Deployment Guide

Complete guide for containerizing and deploying the Nested Commenting Platform.

## 📦 Docker Setup

### Prerequisites
- Docker Desktop installed (Windows/Mac/Linux)
- Docker Compose installed (included with Docker Desktop)
- MongoDB Atlas account (for database)

---

## 🐳 Local Development with Docker

### 1. Create Environment File

Create `.env` file in the root directory:

```env
# MongoDB Atlas URI
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-db?retryWrites=true&w=majority

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Admin Secret (optional, for make-admin endpoint)
ADMIN_SECRET=make-me-admin-123

# API Base URL for client
VITE_API_BASE=http://localhost:4000/api
```

### 2. Start Development Environment

```bash
# Start both server and client in development mode
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/api/health

### 3. Rebuild After Code Changes

```bash
# Rebuild and restart
docker-compose up --build

# Rebuild specific service
docker-compose up --build server
docker-compose up --build client
```

---

## 🏭 Production Build with Docker

### 1. Build Production Images

```bash
# Build both images
docker-compose -f docker-compose.prod.yml build

# Build specific service
docker build -t interiit-server:latest ./server --target production
docker build -t interiit-client:latest ./client --target production
```

### 2. Run Production Containers

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

**Access the application:**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:4000

---

## ☁️ Cloud Deployment Options

### Option 1: Render (Recommended - Easiest)

#### Deploy Backend to Render

1. **Create account** at https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure:**
   - Name: `interiit-backend`
   - Environment: `Docker`
   - Dockerfile Path: `server/Dockerfile`
   - Instance Type: Free tier
4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   PORT=4000
   ```
5. **Deploy** → Get URL (e.g., `https://interiit-backend.onrender.com`)

#### Deploy Frontend to Render

1. **New Static Site** → Connect GitHub repo
2. **Configure:**
   - Name: `interiit-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
3. **Environment Variables:**
   ```
   VITE_API_BASE=https://interiit-backend.onrender.com/api
   ```
4. **Deploy** → Get URL (e.g., `https://interiit-frontend.onrender.com`)

**Render `render.yaml` (Infrastructure as Code):**

```yaml
services:
  - type: web
    name: interiit-backend
    env: docker
    dockerfilePath: ./server/Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 4000

  - type: web
    name: interiit-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    envVars:
      - key: VITE_API_BASE
        value: https://interiit-backend.onrender.com/api
```

---

### Option 2: Railway

#### Deploy Backend

1. **Create account** at https://railway.app
2. **New Project** → Deploy from GitHub
3. **Add Service** → Select repo → Choose `server` directory
4. **Configure:**
   - Root Directory: `/server`
   - Build: Docker
5. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   PORT=4000
   ```
6. **Generate Domain** → Get URL

#### Deploy Frontend

1. **Add Service** → Select repo → Choose `client` directory
2. **Configure:**
   - Root Directory: `/client`
   - Build Command: `npm install && npm run build`
   - Start Command: Uses nginx from Dockerfile
3. **Environment Variables:**
   ```
   VITE_API_BASE=https://your-backend.railway.app/api
   ```
4. **Generate Domain** → Get URL

**Railway Configuration File (`railway.json`):**

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node src/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 3: Fly.io

#### Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

#### Deploy Backend

```bash
# Login
fly auth login

# Navigate to server directory
cd server

# Launch (creates fly.toml)
fly launch --name interiit-backend --region sjc

# Set secrets
fly secrets set MONGO_URI="your-mongodb-uri"
fly secrets set JWT_SECRET="your-jwt-secret"

# Deploy
fly deploy

# Get URL
fly status
```

#### Deploy Frontend

```bash
# Navigate to client directory
cd client

# Launch
fly launch --name interiit-frontend --region sjc

# Deploy
fly deploy
```

**Fly.io Configuration (`fly.toml` for server):**

```toml
app = "interiit-backend"
primary_region = "sjc"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 4000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[http_service.checks]]
  interval = "30s"
  timeout = "5s"
  grace_period = "10s"
  method = "GET"
  path = "/api/health"
```

---

### Option 4: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway
(See Railway section above)

#### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel --prod
   ```

3. **Or via Vercel Dashboard:**
   - Go to https://vercel.com
   - Import GitHub repo
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_BASE=https://your-backend.railway.app/api
     ```

**Vercel Configuration (`client/vercel.json`):**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

### Option 5: Netlify (Frontend) + Render (Backend)

#### Deploy Backend to Render
(See Render section above)

#### Deploy Frontend to Netlify

1. **Create `client/netlify.toml`:**
   ```toml
   [build]
     base = "client"
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "20"
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   cd client
   netlify deploy --prod
   ```

3. **Or via Netlify Dashboard:**
   - Import GitHub repo
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
   - Environment variable:
     ```
     VITE_API_BASE=https://your-backend.onrender.com/api
     ```

---

### Option 6: Azure VM (From Scratch)

#### Setup Azure Student Account

1. **Get free credits:** https://azure.microsoft.com/en-us/free/students/
2. **GitHub Student Pack:** https://education.github.com/pack

#### Create and Configure VM

```bash
# Install Azure CLI
# Windows (PowerShell as Admin)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Login
az login

# Create resource group
az group create --name interiit-rg --location eastus

# Create VM (Ubuntu 22.04)
az vm create \
  --resource-group interiit-rg \
  --name interiit-vm \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys

# Open ports
az vm open-port --port 80 --resource-group interiit-rg --name interiit-vm --priority 100
az vm open-port --port 443 --resource-group interiit-rg --name interiit-vm --priority 101
az vm open-port --port 4000 --resource-group interiit-rg --name interiit-vm --priority 102

# Get public IP
az vm show -d --resource-group interiit-rg --name interiit-vm --query publicIps -o tsv
```

#### SSH into VM and Setup

```bash
# SSH into VM (use IP from previous command)
ssh azureuser@<VM-PUBLIC-IP>

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Node.js (optional, for non-Docker deployment)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone your repo
git clone https://github.com/your-username/InterIIT.git
cd InterIIT

# Create .env file
nano .env
# Add: MONGO_URI, JWT_SECRET, etc.

# Start with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or without Docker
# Backend
cd server
npm install
pm2 start src/index.js --name interiit-backend

# Frontend (build and serve with nginx)
cd ../client
npm install
npm run build
sudo apt install -y nginx
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

#### Setup Nginx Reverse Proxy

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/interiit

# Add this configuration:
server {
    listen 80;
    server_name <VM-PUBLIC-IP>;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/interiit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com
```

---

## 🧪 Testing Docker Builds

### Test Server Image

```bash
# Build
docker build -t interiit-server:test ./server --target production

# Run
docker run -p 4000:4000 \
  -e MONGO_URI="your-mongodb-uri" \
  -e JWT_SECRET="test-secret" \
  interiit-server:test

# Test health endpoint
curl http://localhost:4000/api/health
```

### Test Client Image

```bash
# Build
docker build -t interiit-client:test ./client \
  --target production \
  --build-arg VITE_API_BASE=http://localhost:4000/api

# Run
docker run -p 8080:80 interiit-client:test

# Test
curl http://localhost:8080
```

---

## 📊 Monitoring & Logs

### Docker Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f server
docker-compose logs -f client

# View last 100 lines
docker-compose logs --tail=100 server
```

### Container Stats

```bash
# Real-time resource usage
docker stats

# Specific container
docker stats interiit-server-dev
```

### Health Checks

```bash
# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Inspect health
docker inspect --format='{{.State.Health.Status}}' interiit-server-prod
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# Linux/Mac
sudo lsof -ti:4000 | xargs kill -9
```

### Rebuild Without Cache

```bash
docker-compose build --no-cache
docker-compose up --force-recreate
```

### Clean Docker System

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything (careful!)
docker system prune -a --volumes
```

### MongoDB Connection Issues

1. **Check MongoDB Atlas:**
   - Whitelist IP: 0.0.0.0/0 (allow all) in Network Access
   - Database user has correct permissions
   - Connection string is correct

2. **Test connection:**
   ```bash
   docker exec -it interiit-server-dev node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('OK')).catch(e => console.error(e))"
   ```

---

## 🎯 Best Practices

### Security
- ✅ Never commit `.env` files
- ✅ Use secrets management in production
- ✅ Run containers as non-root user
- ✅ Keep images updated
- ✅ Use multi-stage builds for smaller images

### Performance
- ✅ Use `.dockerignore` to exclude unnecessary files
- ✅ Leverage build cache by ordering COPY commands properly
- ✅ Use alpine base images when possible
- ✅ Combine RUN commands to reduce layers

### Deployment
- ✅ Use health checks for automatic recovery
- ✅ Implement proper logging
- ✅ Set resource limits
- ✅ Use environment variables for configuration
- ✅ Tag images with version numbers

---

## 📚 Additional Resources

- **Docker Docs:** https://docs.docker.com/
- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app/
- **Fly.io Docs:** https://fly.io/docs/
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com/
- **Azure Docs:** https://docs.microsoft.com/azure/

---

## 🚀 Quick Start Cheat Sheet

```bash
# Development
docker-compose up              # Start dev environment
docker-compose down            # Stop and remove containers
docker-compose up --build      # Rebuild and start

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml down

# Maintenance
docker-compose restart         # Restart all services
docker-compose ps             # List containers
docker-compose exec server sh # Shell into container
```

---

**Ready to deploy! 🎉**

Choose your preferred platform and follow the guide above. All Docker configurations are production-ready with health checks, security best practices, and optimized builds.
