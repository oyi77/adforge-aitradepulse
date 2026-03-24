# AdForge AI - BerkahKarya Ads Framework

Generate ads dengan 4 Content Models:
1. P.A.S (Problem-Agitate-Solution)
2. Efek Gravitasi
3. Hasil x3
4. Prospects-to-Prospects

## Quick Start

### Local Development
```bash
npm install
node server.js
```

Server akan running di http://localhost:3000

### Deploy to Production

**Option 1: VPS/Server**
```bash
git clone https://github.com/oyi77/adforge-aitradepulse.git
cd adforge-aitradepulse
npm install
PORT=3000 node server.js
```

**Option 2: Docker**
```bash
docker build -t adforge .
docker run -p 3000:3000 adforge
```

**Option 3: PM2 (Recommended)**
```bash
npm install -g pm2
pm2 start server.js --name adforge
pm2 save
pm2 startup
```

## API Endpoint

POST /api/generate-ads
```json
{
  "produk": "Kursus Digital Marketing",
  "target": "Pemilik UMKM usia 25-45 tahun",
  "keunggulan": "Materi praktis, mentor berpengalaman",
  "platform": "Meta Ads",
  "format": "single_image",
  "tone": "santai"
}
```

## Requirements

- Node.js 18+
- OmniRoute running on localhost:20128
- Port 3000 available

## Live Demo

URL: https://adforge.aitradepulse.com (setup custom domain)

## Support

Contact: support@berkahkarya.org
