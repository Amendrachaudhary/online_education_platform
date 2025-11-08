import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './configs/database.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinay from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// initialize express 
const app = express();


// connect to db (optional - won't crash if DB is not available)
try {
    await connectDB();
} catch (error) {
    console.warn('⚠️  Database connection failed, continuing without DB:', error.message);
}

// connect to cloudinary (optional)
try {
    await connectCloudinay();
} catch (error) {
    console.warn('⚠️  Cloudinary connection failed, continuing without it:', error.message);
}


// middleware
app.use(cors());

// Clerk middleware (optional - only if keys are configured)
if (process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes('placeholder') && !process.env.CLERK_SECRET_KEY.includes('your_')) {
    try {
        app.use(clerkMiddleware());
        console.log('✅ Clerk authentication enabled');
    } catch (error) {
        console.warn('⚠️  Clerk middleware failed, continuing without authentication:', error.message);
    }
} else {
    console.warn('⚠️  Clerk not configured, running without authentication');
    // Add a dummy auth middleware for routes that expect req.auth
    app.use((req, res, next) => {
        req.auth = { userId: 'demo-user' }; // Dummy user for testing
        next();
    });
}


// Routes
app.get('/', (req,res)=>{res.send("NANDANI's SCHOOL API is working fine!")})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);



// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
    
})