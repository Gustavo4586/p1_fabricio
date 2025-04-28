import express from 'express';
const router = express.Router();
import CourseController from '../controllers/courseController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Listar todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *       500:
 *         description: Erro ao buscar cursos
 */
router.get('/', CourseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Obter um curso específico
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Dados do curso
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao buscar curso
 */
router.get('/:id', CourseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Criar um novo curso (apenas admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               level:
 *                 type: string
 *                 enum: [iniciante, intermediário, avançado]
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro ao criar curso
 */
router.post('/', authMiddleware, adminMiddleware, CourseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Atualizar um curso (apenas admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               level:
 *                 type: string
 *                 enum: [iniciante, intermediário, avançado]
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao atualizar curso
 */
router.put('/:id', authMiddleware, adminMiddleware, CourseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Excluir um curso (apenas admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso desativado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao desativar curso
 */
router.delete('/:id', authMiddleware, adminMiddleware, CourseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Matricular aluno em um curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       201:
 *         description: Matrícula realizada com sucesso
 *       400:
 *         description: Aluno já matriculado neste curso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Curso não encontrado ou inativo
 *       500:
 *         description: Erro ao realizar matrícula
 */
router.post('/:courseId/enroll', authMiddleware, CourseController.enrollStudent);

/**
 * @swagger
 * /api/courses/student/enrolled:
 *   get:
 *     summary: Listar cursos do aluno
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matrículas do aluno
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar cursos do aluno
 */
router.get('/student/enrolled', authMiddleware, CourseController.getStudentCourses);

export default  router;
