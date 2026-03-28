# AdForge AI Pro - Deployment Guide

**Status:** ✅ Ready to Deploy  
**Date:** 2026-03-28  
**URL:** https://adforge.aitradepulse.com

---

## Architecture

### Unified Tunnel System

```
Internet (DNS: adforge.aitradepulse.com)
    ↓
Cloudflare Tunnel (0621c8e9-edab-448f-9434-17807b184c35)
    ↓
localhost:6969 (cf-router nginx)
    ↓
localhost:3001 (AdForge server via PM2)
```

**Key Components:**
- **Cloudflare Tunnel:** Single entry point for all `*.aitradepulse.com` subdomains
- **cf-router:** Centralized reverse proxy (nginx on port 6969)
- **AdForge Server:** Node.js app on port 3001 (managed by PM2)

---

## Problem Solved

**Before (Conflict):**
- Manual `cloudflared` config at `/etc/cloudflared/config.yml` (tunnel 0621c8e9)
- `cf-router` config at `~/.cloudflare-router/` (tunnel 77bc7e4b) **← Different tunnel!**
- Routes conflicted, new services couldn't be added cleanly

**After (Unified):**
- Both systems now use **same tunnel** (0621c8e9)
- All routes go through `cf-router` centralized proxy (port 6969)
- Adding new service: `cf-router add <name> port <port>` → auto-syncs

---

## Deployment Steps

### 1. Unify Tunnel System (One-time setup)

```bash
cd /tmp
bash unify-tunnel-system.sh
```

This script will:
1. Backup `/etc/cloudflared/config.yml`
2. Install unified config (all routes → port 6969)
3. Restart cloudflared
4. Test adforge route

### 2. Verify cf-router Status

```bash
cf-router status
```

Expected output:
```
adforge                   port       adforge.aitradepulse.com            ✓ healthy
```

### 3. Test Public Access

```bash
curl https://adforge.aitradepulse.com
```

Should return AdForge HTML (not 404).

---

## Adding Future Services

**Easy workflow (no more conflicts!):**

```bash
# Add new app
cf-router add myapp port 5000

# Generate nginx config
cf-router generate

# Reload nginx
cf-router reload

# Check status
cf-router status
```

**That's it!** No need to manually edit cloudflared config or restart tunnel.

---

## Files Changed

### cf-router Config
- `~/.cloudflare-router/config.yml` - Updated tunnel_id to 0621c8e9
- `~/.cloudflare-router/tunnel/config.yml` - Added adforge route
- `~/.cloudflare-router/apps.yaml` - Already had adforge entry

### Cloudflared Config
- `/etc/cloudflared/config.yml` - Replaced with unified config (all → 6969)
- Backup saved to `/tmp/cloudflared-config-backup-*.yml`

---

## Architecture Benefits

✅ **Single Source of Truth:** cf-router manages all routes  
✅ **No Conflicts:** Both systems use same tunnel  
✅ **Easy Add/Remove:** `cf-router add/remove` commands  
✅ **Auto Health Checks:** `cf-router status` shows all services  
✅ **Centralized Proxy:** nginx at 6969 handles SSL/headers/caching

---

## Rollback (If Needed)

```bash
# Stop cloudflared
sudo systemctl stop cloudflared

# Restore backup
sudo cp /tmp/cloudflared-config-backup-*.yml /etc/cloudflared/config.yml

# Start cloudflared
sudo systemctl start cloudflared
```

---

## Monitoring

### Check AdForge Server
```bash
pm2 status adforge
pm2 logs adforge
```

### Check cf-router
```bash
systemctl status cf-router
cf-router status
```

### Check Cloudflared
```bash
systemctl status cloudflared
journalctl -u cloudflared -f
```

### Test Route
```bash
# Local server
curl http://localhost:3001

# cf-router proxy
curl -H "Host: adforge.aitradepulse.com" http://localhost:6969

# Public URL
curl https://adforge.aitradepulse.com
```

---

## Troubleshooting

### 404 on Public URL

**Check:**
1. cf-router status: `cf-router status | grep adforge`
2. nginx config: `ls ~/.cloudflare-router/nginx/sites/adforge*`
3. cloudflared ingress: `grep adforge /etc/cloudflared/config.yml`

**Fix:**
```bash
cf-router generate
cf-router reload
sudo systemctl restart cloudflared
```

### Server Not Responding

**Check:**
```bash
pm2 status adforge
curl http://localhost:3001
```

**Fix:**
```bash
cd ~/projects/adforge-aitradepulse
pm2 restart adforge
# or
pm2 stop adforge && pm2 start server.js --name adforge
```

### cf-router Down

**Check:**
```bash
systemctl status cf-router
```

**Fix:**
```bash
sudo systemctl restart cf-router
```

---

## Master Blueprint Integration (Future)

AdForge currently serves **static demo pages**. To integrate Master Blueprint:

1. Implement 4 Content Models (PAS, Gravitasi, Hasil x3, P2P)
2. Add Product Validation Framework (Value Score calculator)
3. Add Competitive Intelligence (spy tool integration)
4. Enhance creative generation with Hook Engineering
5. Add Visual Psychology engine

See: `master-blueprint-expanded-part1.md` and `part2.md`

---

**Deployment by:** Vilona  
**Date:** 2026-03-28 04:27 WIB  
**Status:** ✅ System Unified, Ready to Deploy
