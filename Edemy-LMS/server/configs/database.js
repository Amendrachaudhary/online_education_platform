import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'nandani_school',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Track if database is connected
let isDBConnected = false;

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    isDBConnected = true;
    console.log('✅ PostgreSQL database connected successfully!');
    
    // Sync models in development (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Set to true to auto-update schema
      console.log('✅ Database models synchronized');
    }
  } catch (error) {
    isDBConnected = false;
    console.error('❌ Unable to connect to the database:', error.message);
    throw error; // Let the caller handle it
  }
};

// Helper to check if DB is available
export const isDatabaseConnected = () => isDBConnected;

export { sequelize, connectDB };
export default sequelize;

