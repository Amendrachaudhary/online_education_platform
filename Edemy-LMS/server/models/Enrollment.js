import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const Enrollment = sequelize.define('Enrollment', {
  enrollment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'course_id'
    }
  },
  enrollment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id'],
      name: 'idx_enrollment_student_course'
    },
    {
      fields: ['student_id']
    },
    {
      fields: ['course_id']
    },
    {
      fields: ['enrollment_date']
    }
  ]
});

export default Enrollment;

