import express from 'express';
const router = express.Router();
import NoteController from '../controllers/noteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Criar uma nova anotação
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *               - content
 *             properties:
 *               courseId:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               metadata:
 *                 type: object
 *                 properties:
 *                   lessonNumber:
 *                     type: integer
 *                   lessonTitle:
 *                     type: string
 *                   color:
 *                     type: string
 *     responses:
 *       201:
 *         description: Anotação criada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Curso não encontrado ou inativo
 *       500:
 *         description: Erro ao criar anotação
 */
router.post('/', authMiddleware, NoteController.createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Obter todas as anotações do usuário
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: Filtrar por anotações favoritas
 *     responses:
 *       200:
 *         description: Lista de anotações
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar anotações
 */
router.get('/', authMiddleware, NoteController.getUserNotes);

/**
 * @swagger
 * /api/notes/course/{courseId}:
 *   get:
 *     summary: Obter anotações do usuário para um curso específico
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: Filtrar por anotações favoritas
 *     responses:
 *       200:
 *         description: Lista de anotações do curso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar anotações do curso
 */
router.get('/course/:courseId', authMiddleware, NoteController.getUserCourseNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Obter uma anotação específica
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da anotação
 *     responses:
 *       200:
 *         description: Dados da anotação
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado a esta anotação
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro ao buscar anotação
 */
router.get('/:id', authMiddleware, NoteController.getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Atualizar uma anotação
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da anotação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               favorite:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *                 properties:
 *                   lessonNumber:
 *                     type: integer
 *                   lessonTitle:
 *                     type: string
 *                   color:
 *                     type: string
 *     responses:
 *       200:
 *         description: Anotação atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado a esta anotação
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro ao atualizar anotação
 */
router.put('/:id', authMiddleware, NoteController.updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Excluir uma anotação
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da anotação
 *     responses:
 *       200:
 *         description: Anotação excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado a esta anotação
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro ao excluir anotação
 */
router.delete('/:id', authMiddleware, NoteController.deleteNote);

/**
 * @swagger
 * /api/notes/stats:
 *   get:
 *     summary: Obter estatísticas de anotações do usuário
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de anotações
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar estatísticas
 */
router.get('/stats', authMiddleware, NoteController.getUserNoteStats);

export default router;
