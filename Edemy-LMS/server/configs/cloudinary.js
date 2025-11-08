import {v2 as cloudinary} from 'cloudinary'

const connectCloudinay = async()=>{
    // Only configure if all keys are provided and valid
    if (process.env.CLOUDINARY_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_SECRET_KEY &&
        !process.env.CLOUDINARY_NAME.includes('placeholder') &&
        !process.env.CLOUDINARY_NAME.includes('your_')) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        console.log('✅ Cloudinary configured');
    } else {
        console.warn('⚠️  Cloudinary not configured, using local file storage');
        // Return a mock uploader for demo
        cloudinary.uploader = {
            upload: async (file) => {
                // Return a mock URL for demo
                return {
                    secure_url: file.path || 'https://via.placeholder.com/400x300?text=Course+Thumbnail',
                    public_id: 'demo-image'
                };
            }
        };
    }
}

export default connectCloudinay;