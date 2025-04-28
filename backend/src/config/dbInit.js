import { sequelize } from '../config/database.js';
import { connectMongoDB } from './mongodb.js';
import * as models from '../models/index.js';


export async function syncDatabase () {
  try {
    
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('Banco de dados PostgreSQL sincronizado com sucesso.');
    
    
    await connectMongoDB();
    console.log('Conexão com MongoDB estabelecida com sucesso.');
    
    
    if (process.env.NODE_ENV === 'development') {
      await createInitialData();
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
    return false;
  }
};


const createInitialData = async () => {
  try {
    
    const categories = await models.Category.bulkCreate([
      { name: 'Programação', description: 'Cursos de programação e desenvolvimento de software' },
      { name: 'Design', description: 'Cursos de design gráfico e UX/UI' },
      { name: 'Marketing Digital', description: 'Cursos de marketing digital e mídias sociais' }
    ]);
    
    
    const admin = await models.User.create({
      name: 'Administrador',
      email: 'admin@cursogestao.com',
      password: 'admin123',
      role: 'admin'
    });
    
    
    const student = await models.User.create({
      name: 'Aluno Teste',
      email: 'aluno@cursogestao.com',
      password: 'aluno123',
      role: 'aluno'
    });
    
 
    const courses = await models.Course.bulkCreate([
      {
        title: 'Introdução ao JavaScript',
        description: 'Aprenda os fundamentos do JavaScript, a linguagem de programação mais popular da web.',
        duration: 20,
        level: 'iniciante',
        categoryId: categories[0].id,
        instructorId: admin.id
      },
      {
        title: 'Design de Interfaces',
        description: 'Aprenda a criar interfaces modernas e responsivas para aplicações web e mobile.',
        duration: 30,
        level: 'intermediário',
        categoryId: categories[1].id,
        instructorId: admin.id
      }
    ]);
    
   
    await models.Enrollment.create({
      userId: student.id,
      courseId: courses[0].id,
      status: 'ativo',
      progress: 0
    });
    
    console.log('Dados iniciais criados com sucesso.');
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
  }
};

export default {
  syncDatabase
};
