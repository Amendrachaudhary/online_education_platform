import { clerkClient } from '@clerk/express';
import { Course, User, Enrollment, Lesson, sequelize } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';
import { Op } from 'sequelize';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        // Update in database
        await User.update(
            { role: 'teacher' },
            { where: { user_id: userId } }
        );

        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add new course
export const addCourse = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        const parsedCourseData = JSON.parse(courseData);
        
        // Upload image (or use placeholder for demo)
        let imageUrl = 'https://via.placeholder.com/400x300?text=Course+Thumbnail';
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path);
                imageUrl = imageUpload.secure_url;
            } catch (error) {
                console.warn('Image upload failed, using placeholder:', error.message);
                // Use placeholder URL for demo
            }
        }
        
        // Create course
        const newCourse = await Course.create({
            course_title: parsedCourseData.courseTitle,
            course_description: parsedCourseData.courseDescription,
            course_thumbnail: imageUrl,
            course_price: parsedCourseData.coursePrice,
            discount: parsedCourseData.discount || 0,
            is_published: parsedCourseData.isPublished !== undefined ? parsedCourseData.isPublished : true,
            teacher_id: educatorId
        }, { transaction });

        // Create lessons from course content
        if (parsedCourseData.courseContent && Array.isArray(parsedCourseData.courseContent)) {
            const lessonsToCreate = [];
            
            for (const chapter of parsedCourseData.courseContent) {
                if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                    for (const lecture of chapter.chapterContent) {
                        lessonsToCreate.push({
                            lesson_title: lecture.lectureTitle,
                            lesson_url: lecture.lectureUrl,
                            lesson_duration: lecture.lectureDuration || 0,
                            is_preview_free: lecture.isPreviewFree !== undefined ? lecture.isPreviewFree : true,
                            lesson_order: lecture.lectureOrder || 0,
                            chapter_title: chapter.chapterTitle,
                            chapter_order: chapter.chapterOrder || 0,
                            course_id: newCourse.course_id
                        });
                    }
                }
            }
            
            if (lessonsToCreate.length > 0) {
                await Lesson.bulkCreate(lessonsToCreate, { transaction });
            }
        }

        await transaction.commit();
        res.json({ success: true, message: "Course Added", course: newCourse });
    } catch (error) {
        await transaction.rollback();
        res.json({ success: false, message: error.message });
    }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.findAll({
            where: { teacher_id: educator },
            include: [{
                model: Lesson,
                as: 'lessons',
                attributes: ['lesson_id', 'lesson_title', 'lesson_order']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get educator dashboard data
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.findAll({
            where: { teacher_id: educator }
        });

        const totalCourses = courses.length;
        const courseIds = courses.map(course => course.course_id);

        // Calculate total enrollments (no payment tracking)
        const enrollments = await Enrollment.findAll({
            where: {
                course_id: { [Op.in]: courseIds }
            }
        });

        const totalEarnings = "0.00"; // No payment tracking

        // Get enrolled students with course info
        const enrollmentsWithDetails = await Enrollment.findAll({
            where: {
                course_id: { [Op.in]: courseIds }
            },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['user_id', 'name', 'image_url']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['course_id', 'course_title']
                }
            ]
        });

        const enrolledStudentsData = enrollmentsWithDetails.map(enrollment => ({
            courseTitle: enrollment.course?.course_title || 'Unknown',
            student: enrollment.student
        }));

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get enrolled students data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        
        const courses = await Course.findAll({
            where: { teacher_id: educator }
        });

        const courseIds = courses.map(course => course.course_id);

        const enrollments = await Enrollment.findAll({
            where: {
                course_id: { [Op.in]: courseIds }
            },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['course_id', 'course_title']
                },
                {
                    model: User,
                    as: 'student',
                    attributes: ['user_id', 'name', 'image_url']
                }
            ]
        });

        const enrolledStudents = enrollments.map(enrollment => ({
            student: enrollment.student,
            courseTitle: enrollment.course.course_title,
            enrollmentDate: enrollment.enrollment_date
        }));

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
