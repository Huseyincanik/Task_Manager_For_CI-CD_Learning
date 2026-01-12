# GitHub Actions CI/CD Öğrenme Rehberi

## 🎯 Giriş

Bu rehber, GitHub Actions kullanarak CI/CD pipeline'larını öğrenmeniz için hazırlanmıştır. Her workflow detaylı olarak açıklanmıştır.

## 📚 Temel Kavramlar

### Workflow Nedir?
Workflow, otomatik olarak çalışan bir iş akışıdır. `.github_action/workflows/` dizininde YAML dosyaları olarak tanımlanır.

### Job Nedir?
Bir workflow içinde çalışan bağımsız görevlerdir. Paralel veya sıralı çalışabilir.

### Step Nedir?
Bir job içinde sırayla çalışan komutlardır.

### Action Nedir?
Tekrar kullanılabilir, hazır komut setleridir (örn: `actions/checkout@v4`).

## 🔄 CI Workflow Detayları

### Dosya: `.github_action/workflows/ci.yml`

```yaml
name: CI - Test & Build

on:
  push:
    branches: [ main, develop ]  # main ve develop branch'lerine push olunca
  pull_request:
    branches: [ main, develop ]  # PR açılınca
```

**Öğrenilen Konular**:
- ✅ **Trigger (Tetikleyici)**: `on` ile ne zaman çalışacağını belirleriz
- ✅ **Branch Filtering**: Sadece belirli branch'lerde çalışır
- ✅ **Event Types**: push, pull_request, schedule, workflow_dispatch vb.

### Matrix Strategy

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

**Ne İşe Yarar?**
- Aynı testi farklı Node.js versiyonlarında çalıştırır
- Compatibility kontrolü sağlar
- 2 farklı job oluşturur (18.x ve 20.x için)

**Gerçek Dünya Kullanımı**:
- Farklı OS'lerde test (ubuntu, windows, macos)
- Farklı dil versiyonlarında test
- Farklı browser'larda test

### Caching

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: backend/package-lock.json
```

**Faydaları**:
- ⚡ Build süresini %50-70 azaltır
- 💰 GitHub Actions dakikalarından tasarruf
- 🚀 node_modules her seferinde indirilmez

### Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: frontend-build
    path: frontend/build/
    retention-days: 7
```

**Ne İşe Yarar?**:
- Build çıktılarını saklar
- Diğer job'lar kullanabilir
- Manuel indirebilirsiniz
- Test raporları, coverage, build dosyaları için

## 🔍 Code Quality Workflow

### ESLint Integration

```yaml
- name: Run ESLint
  working-directory: ./backend
  run: npm run lint
  continue-on-error: true
```

**Öğrenilen Konular**:
- `working-directory`: Komutun çalışacağı dizin
- `continue-on-error`: Hata olsa bile devam et
- Code quality gates

### Security Audit

```yaml
- name: Audit dependencies
  run: npm audit --audit-level=moderate
```

**Ne Kontrol Eder?**:
- Bilinen güvenlik açıkları
- Outdated dependencies
- License sorunları

### CodeQL Analysis

```yaml
- name: Run CodeQL Analysis
  uses: github/codeql-action/init@v2
  with:
    languages: javascript
```

**Faydaları**:
- Static code analysis
- Security vulnerability detection
- GitHub Security tab'de raporlar

## 🐳 Docker Workflow

### Multi-stage Build

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

**Avantajları**:
- ✅ Küçük image boyutu
- ✅ Build dependencies production'da yok
- ✅ Güvenli ve optimize

### Container Registry

```yaml
- name: Log in to Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

**Öğrenilen Konular**:
- GitHub Container Registry (ghcr.io)
- Automatic authentication
- Image tagging strategies

### Image Tagging

```yaml
tags: |
  type=ref,event=branch          # main, develop
  type=semver,pattern={{version}} # v1.0.0
  type=sha,prefix={{branch}}-     # main-abc123
```

**Tag Örnekleri**:
- `ghcr.io/user/repo-backend:main`
- `ghcr.io/user/repo-backend:v1.0.0`
- `ghcr.io/user/repo-backend:main-abc123`

### Build Cache

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

**Faydaları**:
- Docker layer caching
- Çok daha hızlı builds
- Bandwidth tasarrufu

## 🚀 Deployment Workflow

### Environment Protection

```yaml
environment:
  name: production
  url: https://example.com
```

**GitHub Settings'de Yapılması Gerekenler**:
1. Settings → Environments → New environment
2. "production" adında environment oluştur
3. Protection rules ekle:
   - Required reviewers (1-6 kişi)
   - Wait timer (örn: 5 dakika)
   - Deployment branches (sadece main)

### Manual Trigger

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
```

**Kullanımı**:
1. GitHub → Actions → Deploy workflow
2. "Run workflow" butonuna tıkla
3. Environment seç
4. "Run workflow" ile başlat

### Secrets Kullanımı

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Secret Ekleme**:
1. Settings → Secrets and variables → Actions
2. "New repository secret"
3. Name ve Value gir
4. Workflow'da `${{ secrets.SECRET_NAME }}` ile kullan

## 📦 Release Workflow

### Semantic Versioning

```bash
# Major version (breaking changes)
git tag -a v2.0.0 -m "Release v2.0.0"

# Minor version (new features)
git tag -a v1.1.0 -m "Release v1.1.0"

# Patch version (bug fixes)
git tag -a v1.0.1 -m "Release v1.0.1"
```

### Automatic Changelog

```yaml
- name: Generate changelog
  uses: metcalfc/changelog-generator@v4.1.0
```

**Çıktı Örneği**:
```markdown
## What's Changed
* feat: Add user authentication by @user1
* fix: Fix database connection by @user2
* docs: Update README by @user3
```

## 🎓 Best Practices

### 1. Workflow Organizasyonu
```
.github_action/workflows/
├── ci.yml              # Her PR'da çalışır
├── code-quality.yml    # Her PR'da çalışır
├── docker.yml          # Main'e merge'de çalışır
├── deploy.yml          # Manuel veya main'de
└── release.yml         # Tag'lerde çalışır
```

### 2. Job Dependencies

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: [test]  # test job'ı başarılı olmalı
    runs-on: ubuntu-latest
    steps: [...]
```

### 3. Conditional Execution

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: ./deploy.sh
```

### 4. Reusable Workflows

```yaml
# .github_action/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
```

## 🔧 Troubleshooting

### Workflow Çalışmıyor
1. `.github_action/workflows/` dizininde mi?
2. YAML syntax doğru mu? (yamllint.com)
3. Trigger doğru mu? (on: push, pull_request)
4. Branch filter doğru mu?

### Job Fail Oluyor
1. Logs'u kontrol et (Actions tab → Failed job)
2. Local'de çalışıyor mu?
3. Dependencies yüklü mü?
4. Environment variables doğru mu?

### Cache Çalışmıyor
1. `package-lock.json` commit'li mi?
2. Cache key doğru mu?
3. Cache size limiti (10GB) aşılmış mı?

## 📊 Monitoring & Metrics

### Workflow Status Badge

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
```

### Notifications

```yaml
- name: Notify on Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎯 Pratik Önerileri

### Başlangıç Seviyesi
1. ✅ Basit CI workflow oluştur (test + build)
2. ✅ Branch protection rules ekle
3. ✅ Status badge ekle

### Orta Seviye
1. ✅ Matrix strategy kullan
2. ✅ Caching ekle
3. ✅ Code quality checks ekle
4. ✅ Docker build ekle

### İleri Seviye
1. ✅ Multi-environment deployment
2. ✅ Reusable workflows
3. ✅ Custom actions yaz
4. ✅ Self-hosted runners kullan

## 📚 Ek Kaynaklar

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [Action Marketplace](https://github.com/marketplace?type=actions)
- [GitHub Learning Lab](https://lab.github.com/)

---

**Happy Learning! 🚀**

