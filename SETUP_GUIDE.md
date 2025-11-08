# NANDANI's SCHOOL - Complete Setup Guide

## Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/Amendrachaudhary/online_education_platform.git
cd online_education_platform
```

## Step 2: Install Dependencies

### Install Server Dependencies
```bash
cd Edemy-LMS/server
npm install
```

### Install Client Dependencies
```bash
cd ../client
npm install
```

## Step 3: Environment Setup

### Server Environment (.env file)
```bash
cd ../server
```

Create a `.env` file in the `server` folder with the following content:

```env
# Server Configuration
PORT=5000

# Database (Optional for demo - leave as is if not using real DB)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=education_system
DB_PORT=5432

# Clerk Authentication (Optional for demo)
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Cloudinary (Optional for demo)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Client Environment (.env file)
```bash
cd ../client
```

Create a `.env` file in the `client` folder with the following content:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

## Step 4: Run the Project

### Terminal 1 - Start the Server
```bash
cd Edemy-LMS/server
npm run server
```

The server will run on: **http://localhost:5000**

### Terminal 2 - Start the Client
```bash
cd Edemy-LMS/client
npm run dev
```

The client will run on: **http://localhost:5173** (or another port if 5173 is busy)

## Step 5: Access the Application

- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: http://localhost:5000

## Demo Mode Notes

The project works in **DEMO MODE** without requiring:
- Real database connection
- Clerk authentication
- Cloudinary setup
- Payment processing

All features work with dummy data for demonstration purposes.

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in server `.env` file
- Vite will automatically use the next available port

### Node Modules Issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues (Linux/Mac)
```bash
# Make sure you have permissions
sudo chown -R $USER:$USER .
```

## Project Structure

```
online_education_platform/
├── Edemy-LMS/
│   ├── client/          # React Frontend
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── server/          # Node.js Backend
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── server.js
└── README.md
```

## Features Included

✅ Student Portal
✅ Educator Dashboard
✅ Course Management
✅ Enrollment System
✅ Video Player
✅ CRM Portal with CSV Export
✅ Search Functionality
✅ Responsive Design

## Support

For issues or questions, check the repository:
https://github.com/Amendrachaudhary/online_education_platform

