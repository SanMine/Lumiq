#!/bin/bash

# Lumiq Backend - MongoDB Migration Verification Script

echo "🔍 Verifying MongoDB Migration..."
echo ""

# Check Node.js version
echo "✓ Node.js version:"
node --version

# Check npm packages
echo ""
echo "✓ Installed packages:"
npm list mongoose bcryptjs express cors morgan dotenv jsonwebtoken --depth=0 2>/dev/null || echo "Checking..."

# Check file structure
echo ""
echo "✓ Project Structure:"
echo "  - Models:"
ls -1 src/models/*.js 2>/dev/null | sed 's/^/    /'

echo "  - Routes:"
ls -1 src/routes/*.js 2>/dev/null | sed 's/^/    /'

echo "  - Services:"
ls -1 src/services/*.js 2>/dev/null | sed 's/^/    /'

echo "  - Middlewares:"
ls -1 src/middlewares/*.js 2>/dev/null | sed 's/^/    /'

echo "  - Database:"
ls -1 src/db/*.js 2>/dev/null | sed 's/^/    /'

# Check .env
echo ""
echo "✓ Environment Configuration:"
if [ -f .env ]; then
    grep -E "MONGODB_URI|NODE_ENV|PORT" .env
else
    echo "  ⚠️  .env file not found"
fi

# Removed files check
echo ""
echo "✓ Old MySQL Files Cleanup:"
if [ ! -f sequelize.js ]; then
    echo "  ✅ sequelize.js removed"
else
    echo "  ❌ sequelize.js still exists!"
fi

if [ ! -d config ]; then
    echo "  ✅ config/ directory removed"
else
    echo "  ❌ config/ directory still exists!"
fi

if [ ! -d migrations ]; then
    echo "  ✅ migrations/ directory removed"
else
    echo "  ❌ migrations/ directory still exists!"
fi

echo ""
echo "🎉 Migration Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Start the server: npm run dev"
echo "  2. Test health endpoint: curl http://localhost:5000/api/health"
echo "  3. Check MONGODB_URI in .env is correct"
echo "  4. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0"
echo ""
