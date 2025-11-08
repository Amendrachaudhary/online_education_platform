import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const Review = sequelize.define('Review', {
  review_id: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id'],
      name: 'idx_review_student_course'
    },
    {
      fields: ['course_id']
    },
    {
      fields: ['student_id']
    },
    {
      fields: ['rating']
    }
  ]
});

export default Review;

