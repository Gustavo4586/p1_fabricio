import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Category from './Category.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('iniciante', 'intermediário', 'avançado'),
    defaultValue: 'iniciante'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});


Course.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });


const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('ativo', 'concluído', 'cancelado'),
    defaultValue: 'ativo'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});


User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', as: 'courses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', as: 'students' });

export default { Course, Enrollment };
