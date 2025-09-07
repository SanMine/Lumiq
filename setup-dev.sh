#!/bin/bash

# Lumiq Development Setup Script
echo "🚀 Setting up Lumiq development environment..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials!"
    echo "   Contact your team lead for Railway database connection details."
else
    echo "✅ Backend .env file already exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo "🎉 Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update backend/.env with Railway database credentials"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Visit http://localhost:5173"
