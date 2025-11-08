import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const Progress = sequelize.define('Progress', {
  progress_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'enrollments',
      key: 'enrollment_id'
    }
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'lesson_id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started',
    allowNull: false
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'progress',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['enrollment_id', 'lesson_id'],
      name: 'idx_progress_enrollment_lesson'
    },
    {
      fields: ['enrollment_id']
    },
    {
      fields: ['lesson_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default Progress;

