#!/usr/bin/env bash
# start.sh — Start NexusDistribute (Docker + Next.js dev server)
# Runs PostgreSQL, Redis, and the Next.js dev server in parallel.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

export DATABASE_URL="postgresql://nexus:nexus_password@localhost:5433/nexus_distribute"
export DIRECT_URL="postgresql://nexus:nexus_password@localhost:5433/nexus_distribute"

echo "========================================"
echo "  NexusDistribute — Starting"
echo "========================================"

# 1. Start Docker services (PostgreSQL + Redis) in background
echo "🐳 Starting Docker services..."
docker compose up -d 2>/dev/null || true

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
for i in $(seq 1 20); do
  if docker compose exec -T postgres pg_isready -U nexus -d nexus_distribute &>/dev/null; then
    echo "✅ PostgreSQL ready."
    break
  fi
  sleep 1
done

# 2. Ensure Prisma is generated
npx prisma generate --quiet 2>/dev/null || true

# 3. Start Next.js dev server
echo ""
echo "🚀 Starting Next.js dev server..."
echo "   → http://localhost:3000"
echo ""
echo "  Demo Credentials:"
echo "    Admin:     admin@nexusdistribute.com / password123"
echo "    Shop:      shop1@test.com            / password123"
echo "    Delivery:  delivery@nexusdistribute.com / password123"
echo ""
echo "  Press Ctrl+C to stop."
echo "========================================"
echo ""

npm run dev
