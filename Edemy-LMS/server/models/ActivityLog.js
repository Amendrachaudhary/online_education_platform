import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const ActivityLog = sequelize.define('ActivityLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  table_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  record_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  old_values: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'activity_logs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['table_name']
    },
    {
      fields: ['record_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default ActivityLog;

