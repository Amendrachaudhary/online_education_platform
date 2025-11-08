import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  course_thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  course_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  tableName: 'courses',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['teacher_id']
    },
    {
      fields: ['is_published']
    }
  ]
});

export default Course;
