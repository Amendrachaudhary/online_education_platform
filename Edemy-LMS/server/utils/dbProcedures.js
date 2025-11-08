import { sequelize } from '../configs/database.js';

/**
 * Database Stored Procedures Helper Functions
 * These functions demonstrate the use of stored procedures defined in education_system.sql
 */

/**
 * Enroll a student in a course using the stored procedure
 * This demonstrates atomic enrollment + payment creation via stored procedure
 */
export const enrollStudentProcedure = async (studentId, courseId, amount) => {
    try {
        const [results] = await sequelize.query(
            `SELECT enroll_student(:studentId, :courseId, :amount) as enrollment_id`,
            {
                replacements: { studentId, courseId, amount },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return results.enrollment_id;
    } catch (error) {
        throw new Error(`Enrollment procedure failed: ${error.message}`);
    }
};

/**
 * Compute course progress percentage using stored procedure
 */
export const computeCourseProgressProcedure = async (studentId, courseId) => {
    try {
        const [results] = await sequelize.query(
            `SELECT compute_course_progress(:studentId, :courseId) as completion_percentage`,
            {
                replacements: { studentId, courseId },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return parseFloat(results.completion_percentage);
    } catch (error) {
        throw new Error(`Progress computation failed: ${error.message}`);
    }
};

/**
 * Get top courses by enrollment using stored procedure
 */
export const getTopCoursesProcedure = async (limit = 5) => {
    try {
        const results = await sequelize.query(
            `SELECT * FROM get_top_courses_by_enrollment(:limit)`,
            {
                replacements: { limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return results;
    } catch (error) {
        throw new Error(`Top courses query failed: ${error.message}`);
    }
};

/**
 * Execute raw SQL query with transaction
 * Example: Complex query for students who haven't completed course after 30 days
 */
export const getIncompleteCoursesAfter30Days = async () => {
    try {
        const results = await sequelize.query(
            `SELECT 
                u.name,
                c.course_title,
                e.enrollment_date,
                CURRENT_DATE - e.enrollment_date::DATE as days_enrolled,
                compute_course_progress(u.user_id, c.course_id) as completion_percentage
            FROM users u
            JOIN enrollments e ON u.user_id = e.student_id
            JOIN courses c ON e.course_id = c.course_id
            WHERE CURRENT_DATE - e.enrollment_date::DATE > 30
              AND compute_course_progress(u.user_id, c.course_id) < 100
            ORDER BY days_enrolled DESC`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        return results;
    } catch (error) {
        throw new Error(`Query failed: ${error.message}`);
    }
};

/**
 * Get teacher with highest average rating
 */
export const getTopRatedTeacher = async () => {
    try {
        const [results] = await sequelize.query(
            `SELECT 
                u.name,
                AVG(r.rating) as avg_rating,
                COUNT(r.review_id) as review_count
            FROM users u
            JOIN courses c ON u.user_id = c.teacher_id
            JOIN reviews r ON c.course_id = r.course_id
            WHERE u.role = 'teacher'
            GROUP BY u.user_id, u.name
            ORDER BY avg_rating DESC
            LIMIT 1`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        return results;
    } catch (error) {
        throw new Error(`Query failed: ${error.message}`);
    }
};

