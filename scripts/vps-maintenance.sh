#!/bin/bash
set -e

# =============================================================
# Mayr-Dach VPS Maintenance Script
# Run: ssh vps "bash -s" < scripts/vps-maintenance.sh
# =============================================================

echo "=== VPS Maintenance Report ==="
echo ""

# 1. System info
echo ">>> System Info:"
echo "  Hostname: $(hostname)"
echo "  OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "  Kernel: $(uname -r)"
echo "  Uptime: $(uptime -p)"
echo ""

# 2. Check for updates
echo ">>> Available Updates:"
apt update -qq 2>/dev/null
UPDATES=$(apt list --upgradable 2>/dev/null | grep -v "Listing" | wc -l)
echo "  $UPDATES packages can be upgraded"
if [ "$UPDATES" -gt 0 ]; then
  apt list --upgradable 2>/dev/null | grep -v "Listing"
fi
echo ""

# 3. Check security updates specifically
echo ">>> Security Updates:"
if command -v unattended-upgrades &> /dev/null; then
  echo "  unattended-upgrades: INSTALLED"
  systemctl is-active unattended-upgrades 2>/dev/null && echo "  Status: ACTIVE" || echo "  Status: INACTIVE"
else
  echo "  unattended-upgrades: NOT INSTALLED"
  echo "  RECOMMENDATION: Install with 'apt install unattended-upgrades'"
fi
echo ""

# 4. Check mayr-dach service
echo ">>> Mayr-Dach Service:"
systemctl status mayr-dach --no-pager 2>/dev/null | head -10 || echo "  Service not found"
echo ""

# 5. Check disk usage
echo ">>> Disk Usage:"
df -h / | tail -1
echo ""

# 6. Check PostgreSQL
echo ">>> PostgreSQL:"
systemctl is-active postgresql 2>/dev/null && echo "  Status: RUNNING" || echo "  Status: NOT RUNNING"
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('mayrdach'));" 2>/dev/null || echo "  Could not query DB size"
echo ""

# 7. Check Caddy
echo ">>> Caddy:"
systemctl is-active caddy 2>/dev/null && echo "  Status: RUNNING" || echo "  Status: NOT RUNNING"
echo ""

# 8. Check firewall
echo ">>> Firewall:"
if command -v ufw &> /dev/null; then
  ufw status 2>/dev/null
else
  echo "  UFW not installed"
fi
echo ""

echo "=== End of Maintenance Report ==="
