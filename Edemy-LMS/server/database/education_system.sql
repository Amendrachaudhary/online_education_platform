-- ============================================
-- NANDANI's SCHOOL - Database Schema
-- PostgreSQL Database for Learning Management System
-- ============================================

-- Drop existing database objects if they exist (for fresh setup)
DROP DATABASE IF EXISTS nandani_school;
CREATE DATABASE nandani_school;
\c nandani_school;

-- ============================================
-- 1. TABLES (Normalized to 3NF)
-- ============================================

-- Users Table
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_title VARCHAR(255) NOT NULL,
    course_description TEXT NOT NULL,
    course_thumbnail TEXT,
    course_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (course_price >= 0),
    discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    teacher_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_url TEXT NOT NULL,
    lesson_duration INTEGER NOT NULL DEFAULT 0 CHECK (lesson_duration >= 0),
    is_preview_free BOOLEAN DEFAULT TRUE NOT NULL,
    lesson_order INTEGER NOT NULL DEFAULT 0,
    chapter_title VARCHAR(255),
    chapter_order INTEGER DEFAULT 0,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table (Many-to-Many: Students ↔ Courses)
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Progress Table
CREATE TABLE progress (
    progress_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lesson_id)
);

-- Payments Table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER UNIQUE NOT NULL REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    student_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Activity Logs Table (for trigger logging)
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. INDEXES (Performance Optimization)
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, chapter_order, lesson_order);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_date ON enrollments(enrollment_date);
CREATE INDEX idx_progress_enrollment ON progress(enrollment_id);
CREATE INDEX idx_progress_lesson ON progress(lesson_id);
CREATE INDEX idx_progress_status ON progress(status);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_activity_logs_table ON activity_logs(table_name);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- ============================================
-- 3. STORED PROCEDURES
-- ============================================

-- Procedure: Enroll Student (with transaction)
CREATE OR REPLACE FUNCTION enroll_student(
    p_student_id VARCHAR(255),
    p_course_id INTEGER,
    p_amount DECIMAL(10, 2)
) RETURNS INTEGER AS $$
DECLARE
    v_enrollment_id INTEGER;
BEGIN
    -- Start transaction
    BEGIN
        -- Insert enrollment
        INSERT INTO enrollments (student_id, course_id, enrollment_date)
        VALUES (p_student_id, p_course_id, CURRENT_TIMESTAMP)
        RETURNING enrollment_id INTO v_enrollment_id;
        
        -- Insert payment
        INSERT INTO payments (enrollment_id, student_id, amount, status)
        VALUES (v_enrollment_id, p_student_id, p_amount, 'completed');
        
        RETURN v_enrollment_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Enrollment failed: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Compute Course Progress Percentage
CREATE OR REPLACE FUNCTION compute_course_progress(
    p_student_id VARCHAR(255),
    p_course_id INTEGER
) RETURNS DECIMAL(5, 2) AS $$
DECLARE
    v_total_lessons INTEGER;
    v_completed_lessons INTEGER;
    v_percentage DECIMAL(5, 2);
BEGIN
    -- Get total lessons in course
    SELECT COUNT(*) INTO v_total_lessons
    FROM lessons
    WHERE course_id = p_course_id;
    
    IF v_total_lessons = 0 THEN
        RETURN 0.00;
    END IF;
    
    -- Get completed lessons
    SELECT COUNT(*) INTO v_completed_lessons
    FROM progress p
    JOIN enrollments e ON p.enrollment_id = e.enrollment_id
    WHERE e.student_id = p_student_id
      AND e.course_id = p_course_id
      AND p.status = 'completed';
    
    -- Calculate percentage
    v_percentage := (v_completed_lessons::DECIMAL / v_total_lessons::DECIMAL) * 100;
    
    RETURN ROUND(v_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Procedure: Get Top Courses by Enrollment
CREATE OR REPLACE FUNCTION get_top_courses_by_enrollment(
    p_limit INTEGER DEFAULT 5
) RETURNS TABLE (
    course_id INTEGER,
    course_title VARCHAR(255),
    enrollment_count BIGINT,
    total_revenue DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.course_id,
        c.course_title,
        COUNT(e.enrollment_id)::BIGINT as enrollment_count,
        COALESCE(SUM(p.amount), 0)::DECIMAL(10, 2) as total_revenue
    FROM courses c
    LEFT JOIN enrollments e ON c.course_id = e.course_id
    LEFT JOIN payments p ON e.enrollment_id = p.enrollment_id AND p.status = 'completed'
    WHERE c.is_published = TRUE
    GROUP BY c.course_id, c.course_title
    ORDER BY enrollment_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Trigger Function: Update Progress on Lesson Completion
CREATE OR REPLACE FUNCTION update_course_progress_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE progress
        SET completed_at = CURRENT_TIMESTAMP
        WHERE progress_id = NEW.progress_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_progress_completion
    AFTER UPDATE ON progress
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION update_course_progress_on_completion();

-- Trigger Function: Auto-enroll on Payment Success
CREATE OR REPLACE FUNCTION auto_enroll_on_payment_success()
RETURNS TRIGGER AS $$
DECLARE
    v_enrollment_exists INTEGER;
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Check if enrollment already exists
        SELECT COUNT(*) INTO v_enrollment_exists
        FROM enrollments
        WHERE enrollment_id = NEW.enrollment_id;
        
        -- Enrollment should already exist, but ensure it's linked
        IF v_enrollment_exists = 0 THEN
            RAISE EXCEPTION 'Enrollment not found for payment';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_enroll_payment
    AFTER UPDATE ON payments
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION auto_enroll_on_payment_success();

-- Trigger Function: Log Activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.course_id::VARCHAR, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO activity_logs (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.course_id::VARCHAR, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO activity_logs (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.course_id::VARCHAR, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to courses and enrollments
CREATE TRIGGER trigger_log_courses_activity
    AFTER INSERT OR UPDATE OR DELETE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER trigger_log_enrollments_activity
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

-- ============================================
-- 5. VIEWS (Analytics & Reporting)
-- ============================================

-- View: Top Courses by Enrollment
CREATE OR REPLACE VIEW view_top_courses AS
SELECT 
    c.course_id,
    c.course_title,
    COUNT(e.enrollment_id) as enrollment_count,
    COALESCE(SUM(p.amount), 0) as total_revenue,
    AVG(r.rating) as average_rating
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
LEFT JOIN payments p ON e.enrollment_id = p.enrollment_id AND p.status = 'completed'
LEFT JOIN reviews r ON c.course_id = r.course_id
WHERE c.is_published = TRUE
GROUP BY c.course_id, c.course_title
ORDER BY enrollment_count DESC;

-- View: Teacher Performance
CREATE OR REPLACE VIEW view_teacher_performance AS
SELECT 
    u.user_id,
    u.name as teacher_name,
    u.email,
    COUNT(DISTINCT c.course_id) as total_courses,
    COUNT(DISTINCT e.enrollment_id) as total_enrollments,
    COALESCE(SUM(p.amount), 0) as total_earnings,
    AVG(r.rating) as average_rating
FROM users u
LEFT JOIN courses c ON u.user_id = c.teacher_id
LEFT JOIN enrollments e ON c.course_id = e.course_id
LEFT JOIN payments p ON e.enrollment_id = p.enrollment_id AND p.status = 'completed'
LEFT JOIN reviews r ON c.course_id = r.course_id
WHERE u.role = 'teacher'
GROUP BY u.user_id, u.name, u.email;

-- View: Monthly Enrollment Statistics
CREATE OR REPLACE VIEW view_monthly_enrollments AS
SELECT 
    DATE_TRUNC('month', enrollment_date) as month,
    COUNT(*) as enrollment_count,
    COUNT(DISTINCT student_id) as unique_students,
    COUNT(DISTINCT course_id) as unique_courses
FROM enrollments
GROUP BY DATE_TRUNC('month', enrollment_date)
ORDER BY month DESC;

-- View: Student Progress Summary
CREATE OR REPLACE VIEW view_student_progress AS
SELECT 
    u.user_id,
    u.name as student_name,
    c.course_id,
    c.course_title,
    COUNT(DISTINCT l.lesson_id) as total_lessons,
    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.lesson_id END) as completed_lessons,
    ROUND(
        (COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.lesson_id END)::DECIMAL / 
         NULLIF(COUNT(DISTINCT l.lesson_id), 0)) * 100, 
        2
    ) as completion_percentage
FROM users u
JOIN enrollments e ON u.user_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
LEFT JOIN lessons l ON c.course_id = l.course_id
LEFT JOIN progress p ON e.enrollment_id = p.enrollment_id AND l.lesson_id = p.lesson_id
WHERE u.role = 'student'
GROUP BY u.user_id, u.name, c.course_id, c.course_title;

-- View: Revenue Report
CREATE OR REPLACE VIEW view_revenue_report AS
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    COUNT(*) as payment_count,
    SUM(amount) as total_revenue,
    AVG(amount) as average_payment
FROM payments
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month DESC;

-- ============================================
-- 6. SAMPLE DATA (for testing)
-- ============================================

-- Insert sample users
INSERT INTO users (user_id, name, email, role) VALUES
('user_1', 'John Doe', 'john@example.com', 'student'),
('user_2', 'Jane Smith', 'jane@example.com', 'teacher'),
('user_3', 'Admin User', 'admin@example.com', 'admin'),
('user_4', 'Alice Johnson', 'alice@example.com', 'student');

-- Insert sample courses
INSERT INTO courses (course_title, course_description, course_price, discount, teacher_id) VALUES
('Introduction to Programming', 'Learn the basics of programming', 99.99, 10, 'user_2'),
('Advanced Database Design', 'Master database concepts', 149.99, 15, 'user_2'),
('Web Development Bootcamp', 'Full-stack web development', 199.99, 20, 'user_2');

-- ============================================
-- 7. COMPLEX QUERIES (Examples)
-- ============================================

-- Query 1: Students who haven't completed a course after 30 days
-- SELECT 
--     u.name,
--     c.course_title,
--     e.enrollment_date,
--     CURRENT_DATE - e.enrollment_date::DATE as days_enrolled,
--     compute_course_progress(u.user_id, c.course_id) as completion_percentage
-- FROM users u
-- JOIN enrollments e ON u.user_id = e.student_id
-- JOIN courses c ON e.course_id = c.course_id
-- WHERE CURRENT_DATE - e.enrollment_date::DATE > 30
--   AND compute_course_progress(u.user_id, c.course_id) < 100
-- ORDER BY days_enrolled DESC;

-- Query 2: Teacher with highest average rating
-- SELECT 
--     u.name,
--     AVG(r.rating) as avg_rating,
--     COUNT(r.review_id) as review_count
-- FROM users u
-- JOIN courses c ON u.user_id = c.teacher_id
-- JOIN reviews r ON c.course_id = r.course_id
-- WHERE u.role = 'teacher'
-- GROUP BY u.user_id, u.name
-- ORDER BY avg_rating DESC
-- LIMIT 1;

-- ============================================
-- END OF SCHEMA
-- ============================================

