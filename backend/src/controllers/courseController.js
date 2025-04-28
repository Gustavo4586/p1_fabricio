import  Course from '../models/index.js';
import  Category from '../models/index.js';
import  User from '../models/index.js';
import Enrollment  from '../models/index.js';

const CourseController = {

  async getAllCourses(req, res) {
    try {
      const courses = await Course.findAll({
        where: { active: true },
        include: [
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: User, as: 'instructor', attributes: ['id', 'name'] }
        ]
      });
      
      return res.status(200).json({
        success: true,
        data: courses
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar cursos',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      
      const course = await Course.findByPk(id, {
        include: [
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: User, as: 'instructor', attributes: ['id', 'name'] }
        ]
      });
      
      if (!course || !course.active) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar curso',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async createCourse(req, res) {
    try {
      const { title, description, duration, level, imageUrl, categoryId } = req.body;
      
    
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
      
      
      const course = await Course.create({
        title,
        description,
        duration,
        level,
        imageUrl,
        categoryId,
        instructorId: req.user.id 
      });
      
      return res.status(201).json({
        success: true,
        message: 'Curso criado com sucesso',
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar curso',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { title, description, duration, level, imageUrl, categoryId, active } = req.body;
      
      
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
      
      
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Categoria não encontrada'
          });
        }
      }
      
  
      await course.update({
        title: title || course.title,
        description: description || course.description,
        duration: duration || course.duration,
        level: level || course.level,
        imageUrl: imageUrl || course.imageUrl,
        categoryId: categoryId || course.categoryId,
        active: active !== undefined ? active : course.active
      });
      
      return res.status(200).json({
        success: true,
        message: 'Curso atualizado com sucesso',
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar curso',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      
     
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
      
      
      await course.update({ active: false });
      
      return res.status(200).json({
        success: true,
        message: 'Curso desativado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao desativar curso',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async enrollStudent(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user.id; 
      
      
      const course = await Course.findByPk(courseId);
      if (!course || !course.active) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado ou inativo'
        });
      }
      
      
      const existingEnrollment = await Enrollment.findOne({
        where: { userId, courseId }
      });
      
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'Aluno já matriculado neste curso'
        });
      }
      
      
      const enrollment = await Enrollment.create({
        userId,
        courseId,
        status: 'ativo',
        progress: 0
      });
      
      return res.status(201).json({
        success: true,
        message: 'Matrícula realizada com sucesso',
        data: enrollment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao realizar matrícula',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getStudentCourses(req, res) {
    try {
      const userId = req.user.id;
      
      const enrollments = await Enrollment.findAll({
        where: { userId },
        include: [
          {
            model: Course,
            as: 'course',
            include: [
              { model: Category, as: 'category', attributes: ['id', 'name'] },
              { model: User, as: 'instructor', attributes: ['id', 'name'] }
            ]
          }
        ]
      });
      
      return res.status(200).json({
        success: true,
        data: enrollments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar cursos do aluno',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  }
};

export default CourseController;
