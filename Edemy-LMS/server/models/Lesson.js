import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const Lesson = sequelize.define('Lesson', {
  lesson_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lesson_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lesson_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lesson_duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
    defaultValue: 0
  },
  is_preview_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lesson_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  chapter_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  chapter_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'course_id'
    }
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['course_id']
    },
    {
      fields: ['course_id', 'chapter_order', 'lesson_order']
    }
  ]
});

export default Lesson;

