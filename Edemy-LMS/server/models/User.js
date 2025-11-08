import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    }
  ]
});

export default User;
