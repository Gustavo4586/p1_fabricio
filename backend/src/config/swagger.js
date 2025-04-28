import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Cursos e Anotações',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de cursos e anotações de alunos',
      contact: {
        name: 'Administrador',
        email: 'admin@cursogestao.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Operações relacionadas à autenticação de usuários'
      },
      {
        name: 'Usuários',
        description: 'Operações relacionadas ao gerenciamento de usuários'
      },
      {
        name: 'Cursos',
        description: 'Operações relacionadas ao gerenciamento de cursos'
      },
      {
        name: 'Anotações',
        description: 'Operações relacionadas ao gerenciamento de anotações'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
