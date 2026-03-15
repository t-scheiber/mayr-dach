#!/bin/bash
set -e

echo "=== Mayr Dach VPS Setup ==="
echo ""

# 1. System update
echo ">>> Updating system..."
apt update && apt upgrade -y

# 2. Install essential packages
echo ">>> Installing essentials..."
apt install -y curl git unzip wget gnupg lsb-release

# 3. Install Node.js 24
echo ">>> Installing Node.js 24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# 4. Install Bun
echo ">>> Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> /root/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> /root/.bashrc

# 5. Install PostgreSQL
echo ">>> Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Create database and user
echo ">>> Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE USER mayrdach WITH PASSWORD 'REDACTED_PG_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE mayrdach OWNER mayrdach;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mayrdach TO mayrdach;" 2>/dev/null || true

# 6. Install Caddy
echo ">>> Installing Caddy..."
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# 7. Clone the repo
echo ">>> Cloning repository..."
mkdir -p /opt
if [ -d /opt/mayr-dach ]; then
  cd /opt/mayr-dach && git pull origin main
else
  git clone https://github.com/t-scheiber/mayr-dach.git /opt/mayr-dach
fi
cd /opt/mayr-dach

# 8. Create .env file
echo ">>> Creating .env..."
cat > /opt/mayr-dach/.env << 'ENVEOF'
DATABASE_URL="postgresql://mayrdach:REDACTED_PG_PASSWORD@localhost:5432/mayrdach"

BETTER_AUTH_SECRET=REDACTED_AUTH_SECRET
BETTER_AUTH_URL="https://mayr-dach.com"
NEXT_PUBLIC_BETTER_AUTH_URL="https://mayr-dach.com"

SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="noreply@mayr-dach.com"
SMTP_PASS="REDACTED_SMTP_PASSWORD"
NOTIFICATION_EMAIL="office@mayr-dach.com"
ENVEOF

# 9. Install dependencies and build
echo ">>> Installing dependencies..."
$BUN_INSTALL/bin/bun install

echo ">>> Setting up database..."
npx prisma generate
npx prisma db push

echo ">>> Seeding database..."
$BUN_INSTALL/bin/bun prisma/seed.ts

echo ">>> Building app..."
$BUN_INSTALL/bin/bun run build

# 10. Create systemd service
echo ">>> Creating systemd service..."
cat > /etc/systemd/system/mayr-dach.service << 'SVCEOF'
[Unit]
Description=Mayr Dach Next.js App
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/mayr-dach
ExecStart=/usr/bin/node /opt/mayr-dach/.next/standalone/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/opt/mayr-dach/.env

[Install]
WantedBy=multi-user.target
SVCEOF

# Wait, we're not using standalone anymore. Use next start instead.
cat > /etc/systemd/system/mayr-dach.service << 'SVCEOF'
[Unit]
Description=Mayr Dach Next.js App
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/mayr-dach
ExecStart=/usr/bin/npx next start -p 3000
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=/opt/mayr-dach/.env

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable mayr-dach
systemctl start mayr-dach

# 11. Configure Caddy
echo ">>> Configuring Caddy..."
cat > /etc/caddy/Caddyfile << 'CADDYEOF'
mayr-dach.com {
    reverse_proxy localhost:3000
}

www.mayr-dach.com {
    redir https://mayr-dach.com{uri} permanent
}
CADDYEOF

systemctl restart caddy

echo ""
echo "=== Setup complete! ==="
echo "App running at https://mayr-dach.com"
echo "PostgreSQL: mayrdach@localhost:5432/mayrdach"
echo ""
