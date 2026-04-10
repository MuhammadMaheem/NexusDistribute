#!/usr/bin/env bash
# setup.sh — One-time setup for NexusDistribute
# Installs dependencies, starts Docker services, runs Prisma migrations, and seeds the database.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

export DATABASE_URL="postgresql://nexus:nexus_password@localhost:5433/nexus_distribute"
export DIRECT_URL="postgresql://nexus:nexus_password@localhost:5433/nexus_distribute"

echo "========================================"
echo "  NexusDistribute — Setup"
echo "========================================"

# 1. Check for Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker is required. Please install it first."
  echo "   https://docs.docker.com/engine/install/"
  exit 1
fi

# 2. Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed."

# 3. Start Docker services (PostgreSQL + Redis)
echo ""
echo "🐳 Starting Docker services (PostgreSQL 16 + Redis 7)..."
docker compose up -d
echo "✅ Docker services started."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U nexus -d nexus_distribute &>/dev/null; then
    echo "✅ PostgreSQL is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "❌ PostgreSQL did not become ready in time."
    exit 1
  fi
  sleep 1
done

# 4. Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated."

# 5. Run database migrations
echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init
echo "✅ Database migrations completed."

# 6. Seed database
echo ""
echo "🌱 Seeding database with demo data..."
npx tsx scripts/seed.ts
echo "✅ Database seeded."

echo ""
echo "========================================"
echo "  ✅ Setup Complete!"
echo "========================================"
echo ""
echo "  Demo Credentials:"
echo "    Admin:     admin@nexusdistribute.com / password123"
echo "    Shop:      shop1@test.com            / password123"
echo "    Delivery:  delivery@nexusdistribute.com / password123"
echo ""
echo "  Run 'npm run dev' or './start.sh' to start the app."
echo ""
