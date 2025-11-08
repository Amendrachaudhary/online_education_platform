#!/bin/bash

# NANDANI's SCHOOL - Complete Installation Script
# Copy and paste all commands below at once

echo "🚀 Starting NANDANI's SCHOOL Setup..."

# Step 1: Check Node.js
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Step 2: Clone Repository
echo "📥 Cloning repository..."
if [ -d "online_education_platform" ]; then
    echo "⚠️  Repository already exists, skipping clone..."
    cd online_education_platform
else
    git clone https://github.com/Amendrachaudhary/online_education_platform.git
    cd online_education_platform
fi

# Step 3: Install Server Dependencies
echo "📦 Installing server dependencies..."
cd Edemy-LMS/server
npm install

# Step 4: Install Client Dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Step 5: Create Server .env file
echo "⚙️  Creating server .env file..."
cd ../server
cat > .env << 'ENVEOF'
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=education_system
DB_PORT=5432
CLERK_SECRET_KEY=demo_key
CLOUDINARY_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_SECRET_KEY=demo
FRONTEND_URL=http://localhost:5173
ENVEOF

# Step 6: Create Client .env file
echo "⚙️  Creating client .env file..."
cd ../client
cat > .env << 'ENVEOF'
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
ENVEOF

# Step 7: Go back to root
cd ../..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 To run the project:"
echo ""
echo "Terminal 1 - Server:"
echo "  cd Edemy-LMS/server && npm run server"
echo ""
echo "Terminal 2 - Client:"
echo "  cd Edemy-LMS/client && npm run dev"
echo ""
echo "🌐 Then open: http://localhost:5173"
echo ""

