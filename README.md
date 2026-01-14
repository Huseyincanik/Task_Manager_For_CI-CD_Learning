# 🚀 DevOps CI/CD Learning Project

![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

**DevOps CI/CD öğrenmek için kapsamlı bir demo projesi.** Bu proje, modern bir web uygulaması (Task Manager) ve profesyonel GitHub Actions CI/CD pipeline'ları içerir.


## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Proje Yapısı](#-proje-yapısı)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [GitHub Actions Workflows](#-github-actions-workflows)
- [Docker Kullanımı](#-docker-kullanımı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Öğrenme Kaynakları](#-öğrenme-kaynakları)

<img width="1920" height="1080" alt="Ekran görüntüsü 2026-01-12 083921" src="https://github.com/user-attachments/assets/f6265634-41c4-44e9-a7fd-3122eecfa0e2" />


## ✨ Özellikler

### Uygulama Özellikleri
- ✅ **Full-Stack Task Management** - CRUD operasyonları ile görev yönetimi
- 📊 **Real-time Statistics** - Görev istatistikleri ve dashboard
- 🎨 **Modern UI** - Gradient tasarım, animasyonlar, responsive layout
- 🔒 **Security** - Helmet.js, input validation, SQL injection koruması
- 🧪 **Comprehensive Testing** - Jest, Supertest, React Testing Library

### DevOps Özellikleri
- 🔄 **Continuous Integration** - Otomatik test ve build
- 🔍 **Code Quality** - ESLint, Prettier, CodeQL analizi
- 🐳 **Docker Support** - Multi-stage builds, health checks
- 🚀 **Multi-Environment Deployment** - Dev, Staging, Production
- 📦 **Automated Releases** - Semantic versioning, changelog generation
- 🛡️ **Security Scanning** - Trivy, npm audit, dependency checks

## 🛠 Teknoloji Stack

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: SQLite3
- **Security**: Helmet, CORS, Express Validator
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18.x
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Testing**: Jest, React Testing Library
- **Build**: Create React App

### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (production)
- **Code Quality**: ESLint, Prettier, CodeQL
- **Security**: Trivy, npm audit

## 📁 Proje Yapısı

```
gthbactns/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD workflows
│       ├── ci.yml          # Test & Build pipeline
│       ├── code-quality.yml # Linting & Security
│       ├── docker.yml      # Docker build & push
│       ├── deploy.yml      # Multi-environment deployment
│       └── release.yml     # Automated releases
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── database.js     # Database connection
│   │   └── server.js       # Express server
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend container
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── services/       # API services
│   │   ├── App.js          # Main component
│   │   └── index.css       # Styles
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx configuration
│   └── package.json
├── docker-compose.yml      # Multi-container setup
└── README.md
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.x veya 20.x
- npm 9.x+
- Git
- Docker & Docker Compose (opsiyonel)

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd gthbactns
```

### 2. Bağımlılıkları Yükleyin

```bash
# Tüm bağımlılıkları yükle
npm run install:all

# Veya manuel olarak
cd backend && npm install
cd ../frontend && npm install
```

### 3. Backend'i Başlatın

```bash
cd backend
cp .env.example .env  # Environment variables
npm run dev           # Development mode
```

Backend http://localhost:3001 adresinde çalışacak.

### 4. Frontend'i Başlatın

```bash
cd frontend
npm start
```

Frontend http://localhost:3000 adresinde açılacak.

### 5. Her İkisini Birden Çalıştırın

```bash
# Root dizinden
npm run dev
```

## 🔄 GitHub Actions Workflows

### 1. CI Pipeline (`ci.yml`)

**Tetikleyiciler**: Push ve PR (main, develop)

**İşlevler**:
- ✅ Backend testleri (Node 18.x, 20.x matrix)
- ✅ Frontend testleri (Node 18.x, 20.x matrix)
- ✅ Code coverage raporları
- ✅ Production build
- ✅ Integration testleri
- 📦 Build artifacts

**Öğrenecekleriniz**:
- Matrix strategy kullanımı
- Test coverage raporlama
- Artifact yönetimi
- Multi-job workflows

### 2. Code Quality (`code-quality.yml`)

**Tetikleyiciler**: Push ve PR (main, develop)

**İşlevler**:
- 🔍 ESLint (backend & frontend)
- 💅 Prettier formatting check
- 🔒 npm audit (security)
- 🛡️ CodeQL analysis

**Öğrenecekleriniz**:
- Code linting automation
- Security vulnerability scanning
- Static code analysis
- Code quality gates

### 3. Docker Build (`docker.yml`)

**Tetikleyiciler**: Push (main), tags (v*), PR

**İşlevler**:
- 🐳 Multi-stage Docker builds
- 📦 GitHub Container Registry push
- 🏷️ Automatic tagging (semver, sha)
- 🛡️ Trivy security scanning
- 💾 Build cache optimization

**Öğrenecekleriniz**:
- Docker multi-stage builds
- Container registry kullanımı
- Image tagging strategies
- Security scanning
- Build cache optimization

### 4. Deployment (`deploy.yml`)

**Tetikleyiciler**: Push (main), manual dispatch

**İşlevler**:
- 🌍 Multi-environment support (dev, staging, prod)
- 🔐 Environment protection rules
- 🧪 Smoke tests
- 📢 Team notifications
- ⏪ Automatic rollback

**Öğrenecekleriniz**:
- Environment management
- Manual workflow triggers
- Deployment strategies
- Rollback mechanisms

### 5. Release (`release.yml`)

**Tetikleyiciler**: Git tags (v*)

**İşlevler**:
- 📝 Automatic changelog generation
- 🏷️ GitHub releases
- 📦 Release assets
- 🐳 Tagged Docker images

**Öğrenecekleriniz**:
- Semantic versioning
- Automated releases
- Changelog generation
- Asset management

## 🐳 Docker Kullanımı

### Development

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down
```

### Production

```bash
# Build with production settings
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

### Individual Containers

```bash
# Backend
cd backend
docker build -t devops-backend .
docker run -p 3001:3001 devops-backend

# Frontend
cd frontend
docker build -t devops-frontend --build-arg REACT_APP_API_URL=http://localhost:3001/api .
docker run -p 80:80 devops-frontend
```

## 📚 API Dokümantasyonu

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /health
```

#### Get All Tasks
```http
GET /api/tasks
```

#### Get Single Task
```http
GET /api/tasks/:id
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "high"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Get Statistics
```http
GET /api/tasks/stats/summary
```

## 🎓 Öğrenme Kaynakları

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

### CI/CD Best Practices
- [CI/CD Pipeline Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests
npm test -- --coverage # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test              # Interactive mode
npm test -- --coverage --watchAll=false # CI mode
```

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database.sqlite
```

**Frontend** (build time):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### GitHub Secrets

Repository secrets için:
- `API_URL`: Production API URL
- `GITHUB_TOKEN`: Otomatik olarak sağlanır

## 📝 Workflow Örnekleri

### Yeni Feature Branch
```bash
git checkout -b feature/new-feature
# Kod değişiklikleri
git commit -m "feat: add new feature"
git push origin feature/new-feature
# PR oluştur → CI workflows çalışır
```

### Release Oluşturma
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
# Release workflow çalışır
```

### Manual Deployment
```bash
# GitHub UI → Actions → Deploy → Run workflow
# Environment seç: development/staging/production
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

DevOps Learning Project - GitHub Actions CI/CD Tutorial

---

**🎯 Öğrenme Hedefleri**:
- ✅ GitHub Actions workflow syntax
- ✅ CI/CD pipeline tasarımı
- ✅ Docker containerization
- ✅ Multi-environment deployment
- ✅ Automated testing
- ✅ Security scanning
- ✅ Release automation

**Happy Learning! 🚀**


