#!/bin/bash

echo "🚀 Starting CFP Bot Installation..."

# Update system
sudo apt update -y

# Install Docker
if ! command -v docker &> /dev/null
then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

echo "📦 Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for database..."
sleep 10

echo "🧱 Running Prisma migration..."
docker compose exec web npx prisma migrate deploy

echo "✅ CFP Bot is running on:"
echo "http://SERVER_IP:3000"