# AdForge AI Pro - Live Deployment Test

**Date:** 2026-03-28 04:39 WIB  
**Status:** Ready for Final Testing

---

## Pre-Test Checklist

Before running tests, ensure:

- [ ] Dashboard wildcard route added (`*.aitradepulse.com → localhost:6969`)
- [ ] Cloudflared restarted (or 30 seconds passed since config update)
- [ ] AdForge server running: `pm2 list | grep adforge`
- [ ] cf-router healthy: `cf-router status | grep adforge`

---

## Test Suite

### Test 1: Local Server (Port 3000)

```bash
curl -I http://localhost:3000
```

**Expected:**
```
HTTP/1.1 200 OK
```

### Test 2: cf-router Proxy (Port 6969)

```bash
curl -I -H "Host: adforge.aitradepulse.com" http://localhost:6969
```

**Expected:**
```
HTTP/1.1 200 OK
Content-Type: text/html
```

### Test 3: Public HTTPS (Full Stack)

```bash
curl -I https://adforge.aitradepulse.com
```

**Expected:**
```
HTTP/2 200
```

**If 404:** Wait 30-60 seconds, Cloudflare propagation delay

### Test 4: Content Verification

```bash
curl -s https://adforge.aitradepulse.com | grep -o "<title>[^<]*</title>"
```

**Expected:**
```
<title>AdForge AI - Generate Ads</title>
```

### Test 5: API Endpoint

```bash
curl -I https://adforge.aitradepulse.com/api/health
```

**Expected:**
```
HTTP/2 200
```

---

## Full Test Script

Copy & paste into terminal:

```bash
#!/bin/bash
echo "=== AdForge Live Deployment Tests ==="
echo ""

echo "[1/5] Local Server (port 3000)..."
curl -s -I http://localhost:3000 | head -1
echo ""

echo "[2/5] cf-router Proxy (port 6969)..."
curl -s -I -H "Host: adforge.aitradepulse.com" http://localhost:6969 | head -1
echo ""

echo "[3/5] Public HTTPS..."
curl -s -I https://adforge.aitradepulse.com | head -1
echo ""

echo "[4/5] Title Check..."
curl -s https://adforge.aitradepulse.com | grep -o "<title>[^<]*</title>" || echo "Title not found"
echo ""

echo "[5/5] API Health..."
curl -s -I https://adforge.aitradepulse.com/api/health | head -1
echo ""

echo "=== Test Complete ==="
```

---

## Status Indicators

| Test | Status | Expected | Notes |
|------|--------|----------|-------|
| Local 3000 | ? | 200 | Server process |
| Proxy 6969 | ? | 200 | nginx routing |
| Public HTTPS | ? | 200 | Full tunnel |
| Content | ? | AdForge title | App loaded |
| API | ? | 200 | Backend responding |

---

## Troubleshooting

### Getting 502 on localhost:6969

**Check:**
```bash
pm2 logs adforge --lines 20
curl http://localhost:3000
```

**Fix:** Restart AdForge
```bash
pm2 restart adforge
```

### Getting 404 on public URL

**Check:**
```bash
journalctl -u cloudflared -n 5 --no-pager | grep -i "ingress\|config"
cf-router status | grep adforge
```

**Fix:** Wait 60 seconds for propagation, then retry

### Getting 403/SSL errors

**Check:** DNS resolve
```bash
dig adforge.aitradepulse.com +short
```

Should return Cloudflare IPs (104.21.x.x or 172.67.x.x)

---

## Success Criteria

✅ **Minimum:** All 5 tests return 200  
✅ **Optimal:** <500ms response time  
✅ **Production:** HTML loads with assets (CSS, JS)

---

## Next Steps (After Testing)

1. **Monitor logs** for errors:
   ```bash
   pm2 logs adforge -f
   ```

2. **Check metrics:**
   ```bash
   cf-router status
   systemctl status cloudflared
   systemctl status cf-router
   ```

3. **Performance baseline:**
   ```bash
   curl -w "@curl-format.txt" https://adforge.aitradepulse.com
   ```

4. **Document results** in production runbook

---

**Prepared by:** Vilona  
**Deploy Status:** Ready for Launch
