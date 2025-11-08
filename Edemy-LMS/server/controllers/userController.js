import { User, Course, Enrollment, Progress, Lesson, Review, sequelize } from "../models/index.js";
import { Op } from 'sequelize';

// Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// User enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        const enrollments = await Enrollment.findAll({
            where: { student_id: userId },
            include: [{
                model: Course,
                as: 'course',
                include: [{
                    model: User,
                    as: 'teacher',
                    attributes: ['user_id', 'name', 'email', 'image_url']
                }]
            }]
        });

        const enrolledCourses = enrollments.map(enrollment => enrollment.course);

        res.json({ success: true, enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Purchase course (simplified - just enroll, no payment)
export const purchaseCourse = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        // Validate user and course exist
        const userData = await User.findByPk(userId, { transaction });
        const courseData = await Course.findByPk(courseId, { transaction });

        if (!userData || !courseData) {
            await transaction.rollback();
            return res.json({ success: false, message: "Data Not Found" });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            where: { student_id: userId, course_id: courseId },
            transaction
        });

        if (existingEnrollment) {
            await transaction.rollback();
            return res.json({ success: false, message: "Already enrolled in this course" });
        }

        // Create enrollment (free enrollment, no payment required)
        const enrollment = await Enrollment.create({
            student_id: userId,
            course_id: courseId,
            enrollment_date: new Date()
        }, { transaction });

        await transaction.commit();
        res.json({ success: true, message: "Successfully enrolled in course", enrollment });
        
    } catch (error) {
        await transaction.rollback();
        console.error("Enrollment failed:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update user course progress
export const updateUserCourseProgress = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = req.auth.userId;
        const { courseId, lessonId } = req.body;

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            where: { student_id: userId, course_id: courseId },
            transaction
        });

        if (!enrollment) {
            await transaction.rollback();
            return res.json({ success: false, message: "Not enrolled in this course" });
        }

        // Check if progress already exists
        let progress = await Progress.findOne({
            where: { enrollment_id: enrollment.enrollment_id, lesson_id: lessonId },
            transaction
        });

        if (progress) {
            if (progress.status === 'completed') {
                await transaction.rollback();
                return res.json({ success: true, message: "Lecture Already Completed" });
            }
            progress.status = 'completed';
            progress.completed_at = new Date();
            await progress.save({ transaction });
        } else {
            progress = await Progress.create({
                enrollment_id: enrollment.enrollment_id,
                lesson_id: lessonId,
                status: 'completed',
                completed_at: new Date()
            }, { transaction });
        }

        await transaction.commit();
        res.json({ success: true, message: 'Progress Updated' });
    } catch (error) {
        await transaction.rollback();
        res.json({ success: false, message: error.message });
    }
};

// Get user course progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;

        const enrollment = await Enrollment.findOne({
            where: { student_id: userId, course_id: courseId },
            include: [{
                model: Progress,
                as: 'progress',
                include: [{
                    model: Lesson,
                    as: 'lesson'
                }]
            }]
        });

        if (!enrollment) {
            return res.json({ success: false, message: "Not enrolled in this course" });
        }

        res.json({ success: true, progressData: enrollment });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add user rating to course
export const addUserRating = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = req.auth.userId;
        const { courseId, rating, comment } = req.body;

        if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
            await transaction.rollback();
            return res.json({ success: false, message: "Invalid details" });
        }

        // Check if user is enrolled
        const enrollment = await Enrollment.findOne({
            where: { student_id: userId, course_id: courseId },
            transaction
        });

        if (!enrollment) {
            await transaction.rollback();
            return res.json({ success: false, message: "User has not purchased this course." });
        }

        // Check if review exists
        const [review, created] = await Review.findOrCreate({
            where: { student_id: userId, course_id: courseId },
            defaults: {
                student_id: userId,
                course_id: courseId,
                rating: rating,
                comment: comment || null
            },
            transaction
        });

        if (!created) {
            review.rating = rating;
            if (comment !== undefined) review.comment = comment;
            await review.save({ transaction });
        }

        await transaction.commit();
        res.json({ success: true, message: "Rating Added" });
    } catch (error) {
        await transaction.rollback();
        res.json({ success: false, message: error.message });
    }
};
