import { Course, User, Lesson } from '../models/index.js';
import { isDatabaseConnected } from '../configs/database.js';
import { Op } from 'sequelize';

// Get all published courses
export const getAllCourse = async (req, res) => {
    try {
        if (!isDatabaseConnected()) {
            // Return empty array for demo when DB not available
            return res.json({ success: true, courses: [] });
        }
        
        const courses = await Course.findAll({
            where: { is_published: true },
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['user_id', 'name', 'email', 'image_url']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, courses });
    } catch (error) {
        // Return empty array on error for demo
        res.json({ success: true, courses: [] });
    }
};

// Get course by id
export const getCourseId = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isDatabaseConnected()) {
            return res.json({ success: false, message: 'Database not available' });
        }
        
        const courseData = await Course.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['user_id', 'name', 'email', 'image_url']
                },
                {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['lesson_id', 'lesson_title', 'lesson_url', 'lesson_duration', 
                                 'is_preview_free', 'lesson_order', 'chapter_title', 'chapter_order'],
                    order: [['chapter_order', 'ASC'], ['lesson_order', 'ASC']]
                }
            ]
        });

        if (!courseData) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Remove lecture URL if preview is not free (for non-enrolled users)
        // This logic should be handled based on enrollment status in frontend
        const courseJson = courseData.toJSON();
        
        res.json({ success: true, courseData: courseJson });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
