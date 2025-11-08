import { sequelize } from '../configs/database.js';
import User from './User.js';
import Course from './Course.js';
import Lesson from './Lesson.js';
import Enrollment from './Enrollment.js';
import Progress from './Progress.js';
import Review from './Review.js';
import ActivityLog from './ActivityLog.js';

// Define relationships
const defineRelationships = () => {
  // User relationships
  User.hasMany(Course, { foreignKey: 'teacher_id', as: 'courses' });
  User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
  User.hasMany(Review, { foreignKey: 'student_id', as: 'reviews' });

  // Course relationships
  Course.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
  Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
  Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
  Course.hasMany(Review, { foreignKey: 'course_id', as: 'reviews' });

  // Lesson relationships
  Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
  Lesson.hasMany(Progress, { foreignKey: 'lesson_id', as: 'progress' });

  // Enrollment relationships
  Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
  Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
  Enrollment.hasMany(Progress, { foreignKey: 'enrollment_id', as: 'progress' });

  // Progress relationships
  Progress.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
  Progress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

  // Review relationships
  Review.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
  Review.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
};

// Initialize relationships
defineRelationships();

export {
  sequelize,
  User,
  Course,
  Lesson,
  Enrollment,
  Progress,
  Review,
  ActivityLog
};

