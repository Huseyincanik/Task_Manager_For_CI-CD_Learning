# DevOps CI/CD Öğrenme Yol Haritası

## 🎯 Hedefler

Bu proje ile şunları öğreneceksiniz:
1. GitHub Actions workflow syntax
2. CI/CD pipeline tasarımı
3. Docker containerization
4. Automated testing
5. Multi-environment deployment
6. Security best practices

## 📅 Öğrenme Planı (4 Hafta)

### Hafta 1: Temel Kavramlar ve Setup

#### Gün 1-2: Proje Kurulumu
- [ ] Projeyi klonla ve çalıştır
- [ ] Backend API'yi incele
- [ ] Frontend uygulamasını incele
- [ ] Local'de test et

**Görevler**:
```bash
# 1. Projeyi klonla
git clone <repo-url>
cd gthbactns

# 2. Backend'i çalıştır
cd backend
npm install
npm run dev

# 3. Frontend'i çalıştır (yeni terminal)
cd frontend
npm install
npm start

# 4. API'yi test et
curl http://localhost:3001/health
```

#### Gün 3-4: Git ve GitHub Temelleri
- [ ] Git branch stratejileri öğren
- [ ] Pull Request workflow'u öğren
- [ ] GitHub Issues kullan
- [ ] Branch protection rules ayarla

**Pratik**:
```bash
# Feature branch oluştur
git checkout -b feature/my-first-feature

# Değişiklik yap
echo "# My changes" >> NOTES.md
git add NOTES.md
git commit -m "docs: add my notes"

# Push ve PR oluştur
git push origin feature/my-first-feature
```

#### Gün 5-7: GitHub Actions Temelleri
- [ ] Workflow syntax öğren
- [ ] İlk workflow'u oluştur
- [ ] Triggers (on) kavramını öğren
- [ ] Jobs ve steps'i anla

**Pratik**: Basit bir workflow oluştur
```yaml
# .github/workflows/hello.yml
name: Hello World

on: [push]

jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello, DevOps!"
```

### Hafta 2: CI Pipeline

#### Gün 8-10: Automated Testing
- [ ] `ci.yml` workflow'unu incele
- [ ] Matrix strategy'yi anla
- [ ] Test coverage raporlarını öğren
- [ ] Artifacts kullanımını öğren

**Pratik**:
```bash
# Backend testlerini çalıştır
cd backend
npm test

# Coverage raporu oluştur
npm test -- --coverage

# Frontend testlerini çalıştır
cd frontend
npm test -- --coverage --watchAll=false
```

#### Gün 11-12: Code Quality
- [ ] `code-quality.yml` workflow'unu incele
- [ ] ESLint kullanımını öğren
- [ ] Security audit'i anla
- [ ] CodeQL analysis'i öğren

**Pratik**:
```bash
# Linting çalıştır
cd backend
npm run lint

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

#### Gün 13-14: Build Optimization
- [ ] Caching stratejilerini öğren
- [ ] Build artifact'larını yönet
- [ ] Paralel job execution
- [ ] Conditional execution

**Pratik**: Cache ekle
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Hafta 3: Docker ve Containerization

#### Gün 15-17: Docker Temelleri
- [ ] Dockerfile syntax öğren
- [ ] Multi-stage builds
- [ ] Docker Compose
- [ ] Container networking

**Pratik**:
```bash
# Backend image build et
cd backend
docker build -t my-backend .
docker run -p 3001:3001 my-backend

# Frontend image build et
cd frontend
docker build -t my-frontend .
docker run -p 80:80 my-frontend

# Docker Compose ile çalıştır
docker-compose up
```

#### Gün 18-19: Docker CI/CD
- [ ] `docker.yml` workflow'unu incele
- [ ] Container Registry kullanımı
- [ ] Image tagging strategies
- [ ] Security scanning (Trivy)

**Pratik**: GitHub Container Registry'ye push et
```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag
docker tag my-backend ghcr.io/username/repo-backend:v1.0.0

# Push
docker push ghcr.io/username/repo-backend:v1.0.0
```

#### Gün 20-21: Container Optimization
- [ ] Image size optimization
- [ ] Layer caching
- [ ] Health checks
- [ ] Resource limits

**Pratik**: Image boyutunu küçült
```dockerfile
# Before: node:20 (900MB)
# After: node:20-alpine (150MB)
FROM node:20-alpine
```

### Hafta 4: Deployment ve Production

#### Gün 22-24: Multi-Environment Deployment
- [ ] `deploy.yml` workflow'unu incele
- [ ] Environment protection rules
- [ ] Secrets management
- [ ] Manual approvals

**Pratik**: Environment oluştur
1. GitHub → Settings → Environments
2. "staging" environment oluştur
3. Required reviewers ekle
4. Deployment branch rule ekle (main only)

#### Gün 25-26: Release Management
- [ ] `release.yml` workflow'unu incele
- [ ] Semantic versioning
- [ ] Changelog generation
- [ ] Release notes

**Pratik**: Release oluştur
```bash
# Tag oluştur
git tag -a v1.0.0 -m "First release"

# Push tag
git push origin v1.0.0

# GitHub'da release oluşturuldu!
```

#### Gün 27-28: Monitoring ve Rollback
- [ ] Deployment monitoring
- [ ] Rollback strategies
- [ ] Notifications (Slack, email)
- [ ] Metrics ve logging

**Pratik**: Rollback simüle et
```bash
# Önceki versiyona dön
git revert HEAD
git push origin main

# Veya tag'e dön
git checkout v0.9.0
```

## 🎓 Pratik Projeler

### Proje 1: Basit CI Pipeline (Hafta 1-2)
**Hedef**: Her PR'da testlerin otomatik çalışması

**Adımlar**:
1. `.github/workflows/test.yml` oluştur
2. Backend ve frontend testlerini ekle
3. PR oluştur ve workflow'u izle
4. Status badge ekle

### Proje 2: Docker Build Pipeline (Hafta 3)
**Hedef**: Her commit'te Docker image build et

**Adımlar**:
1. Dockerfile'ları optimize et
2. Multi-stage build kullan
3. GitHub Container Registry'ye push et
4. Image tagging stratejisi belirle

### Proje 3: Full CI/CD Pipeline (Hafta 4)
**Hedef**: Tam otomatik deployment

**Adımlar**:
1. Staging environment oluştur
2. Automatic deployment ekle
3. Smoke tests ekle
4. Production deployment ekle (manual approval)

## 📊 İlerleme Takibi

### Hafta 1 Checklist
- [ ] Proje çalışıyor
- [ ] Git workflow'u anladım
- [ ] İlk workflow'umu oluşturdum
- [ ] PR açıp merge ettim

### Hafta 2 Checklist
- [ ] CI pipeline çalışıyor
- [ ] Testler otomatik çalışıyor
- [ ] Code quality checks aktif
- [ ] Coverage raporları alıyorum

### Hafta 3 Checklist
- [ ] Docker image build edebiliyorum
- [ ] Container Registry kullanıyorum
- [ ] Multi-stage build yapıyorum
- [ ] Security scanning aktif

### Hafta 4 Checklist
- [ ] Multi-environment deployment çalışıyor
- [ ] Release oluşturabiliyorum
- [ ] Rollback yapabiliyorum
- [ ] Monitoring ve alerting var

## 🎯 Sonraki Adımlar

### İleri Seviye Konular
1. **Kubernetes Deployment**
   - Helm charts
   - K8s manifests
   - Rolling updates

2. **Advanced CI/CD**
   - Reusable workflows
   - Custom actions
   - Self-hosted runners

3. **Infrastructure as Code**
   - Terraform
   - CloudFormation
   - Ansible

4. **Monitoring & Observability**
   - Prometheus
   - Grafana
   - ELK Stack

### Sertifikasyon Önerileri
- GitHub Actions Certification
- Docker Certified Associate
- Kubernetes Administrator (CKA)
- AWS DevOps Professional

## 📚 Önerilen Kaynaklar

### Kitaplar
- "The DevOps Handbook" - Gene Kim
- "Continuous Delivery" - Jez Humble
- "Docker Deep Dive" - Nigel Poulton

### Online Kurslar
- GitHub Learning Lab
- Docker Mastery (Udemy)
- Kubernetes for Developers (Pluralsight)

### YouTube Kanalları
- TechWorld with Nana
- DevOps Toolkit
- Cloud Native Computing Foundation

### Blog'lar
- Martin Fowler's Blog
- DevOps.com
- The New Stack

## 🤝 Topluluk

### Discord/Slack Grupları
- DevOps Turkey
- Kubernetes Community
- Docker Community

### Meetup'lar
- DevOps Istanbul
- Cloud Native Turkey
- Docker Turkey

## 💡 İpuçları

### Öğrenme Stratejileri
1. **Hands-on Practice**: Her gün kod yaz
2. **Build in Public**: GitHub'da paylaş
3. **Document Everything**: Blog yaz, notlar al
4. **Join Communities**: Sorular sor, yardım et

### Yaygın Hatalar
1. ❌ Workflow'ları test etmeden push etmek
2. ❌ Secrets'ı hardcode etmek
3. ❌ Cache kullanmamak
4. ❌ Error handling yapmamak

### Best Practices
1. ✅ Her zaman branch protection kullan
2. ✅ PR'larda code review yap
3. ✅ Automated tests yaz
4. ✅ Documentation güncel tut

---

**Başarılar! 🚀**

*Bu yol haritasını takip ederek 4 haftada DevOps ve CI/CD konusunda sağlam bir temel oluşturabilirsiniz.*
