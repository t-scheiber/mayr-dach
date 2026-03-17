#!/bin/bash
set -e

# =============================================================
# Setup Automatic Security Updates on VPS
# Run: ssh vps "bash -s" < scripts/setup-auto-updates.sh
# =============================================================

echo "=== Setting up Automatic Security Updates ==="
echo ""

# 1. Install unattended-upgrades
echo ">>> Installing unattended-upgrades..."
apt install -y unattended-upgrades apt-listchanges

# 2. Configure for security updates only
echo ">>> Configuring..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};

Unattended-Upgrade::Package-Blacklist {
    // Add packages here that should NOT be auto-updated
};

Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

# 3. Enable automatic updates
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
EOF

# 4. Enable and start
systemctl enable unattended-upgrades
systemctl restart unattended-upgrades

echo ""
echo ">>> Automatic security updates configured."
echo "    - Only security updates will be installed automatically"
echo "    - No automatic reboots (manual reboot needed for kernel updates)"
echo "    - Auto-cleanup of old packages every 7 days"
echo ""
echo "Test with: unattended-upgrades --dry-run --debug"
