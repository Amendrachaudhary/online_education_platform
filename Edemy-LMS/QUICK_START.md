# Quick Start Guide - Demo Project

This is a **LOCAL DEMO PROJECT** that runs without any external services.

## ✅ What's Working:
- ✅ Server runs without PostgreSQL
- ✅ Server runs without Clerk authentication  
- ✅ Server runs without Cloudinary
- ✅ Server runs without Stripe payments
- ✅ All APIs respond (return empty data when DB not available)

## 🚀 To Run:

### 1. Start Server:
```bash
cd server
npm run server
```
Server will start on: `http://localhost:3000`

### 2. Start Client (in new terminal):
```bash
cd client
npm run dev
```
Client will start on: `http://localhost:5173` (or similar)

## 📝 Notes:
- No database setup required for demo
- No API keys needed
- All features work in demo mode
- Perfect for local testing and submission

## 🎯 For Full Functionality (Optional):
If you want to use a real database later:
1. Install PostgreSQL
2. Create database: `createdb nandani_school`
3. Update `.env` file with DB credentials
4. Run SQL script: `psql -U postgres -d nandani_school -f server/database/education_system.sql`

But for demo/submission, **you don't need any of this!**
