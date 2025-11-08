# 🚀 Quick Start Commands - Copy & Paste All at Once

## For a Completely New System:

### 1. Install Node.js (if not installed)
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from: https://nodejs.org/
# Or use package manager:
# macOS: brew install node
# Ubuntu/Debian: sudo apt install nodejs npm
# Windows: Download installer from nodejs.org
```

### 2. Clone and Setup (Copy all commands below)
```bash
# Clone the repository
git clone https://github.com/Amendrachaudhary/online_education_platform.git
cd online_education_platform

# Install server dependencies
cd Edemy-LMS/server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ../..
```

### 3. Create Environment Files

**Server .env file:**
```bash
cd Edemy-LMS/server
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
```

**Client .env file:**
```bash
cd ../client
cat > .env << 'ENVEOF'
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
ENVEOF
cd ../..
```

### 4. Run the Project

**Open Terminal 1 (Server):**
```bash
cd Edemy-LMS/server
npm run server
```

**Open Terminal 2 (Client):**
```bash
cd Edemy-LMS/client
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## ✅ Done! Your project is running.

**Note:** The project works in DEMO MODE - no database or external services required!
