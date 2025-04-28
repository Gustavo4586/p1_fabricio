import NoteService from '../services/noteService.js';
import  Course  from '../models/Course.js';


const NoteController = {
  
  async createNote(req, res) {
    try {
      const { courseId, title, content, tags, metadata } = req.body;
      const userId = req.user.id;
      
      
      const course = await Course.findByPk(courseId);
      if (!course || !course.active) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado ou inativo'
        });
      }
      
      
      const noteData = {
        userId,
        courseId,
        title,
        content,
        tags: tags || [],
        metadata: {
          ...metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
      
      const note = await NoteService.createNote(noteData);
      
      return res.status(201).json({
        success: true,
        message: 'Anotação criada com sucesso',
        data: note
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar anotação',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getUserNotes(req, res) {
    try {
      const userId = req.user.id;
      const { favorite } = req.query;
      
      const filters = {};
      if (favorite === 'true') {
        filters.favorite = true;
      }
      
      const notes = await NoteService.getNotesByUser(userId, filters);
      
      return res.status(200).json({
        success: true,
        data: notes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar anotações',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
 
  async getUserCourseNotes(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const { favorite } = req.query;
      
      const filters = {};
      if (favorite === 'true') {
        filters.favorite = true;
      }
      
      const notes = await NoteService.getNotesByUserAndCourse(userId, parseInt(courseId), filters);
      
      return res.status(200).json({
        success: true,
        data: notes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar anotações do curso',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const note = await NoteService.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }
      
      
      if (note.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta anotação'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar anotação',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content, tags, favorite, metadata } = req.body;
      const userId = req.user.id;
      
  o
      const note = await NoteService.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }
      
      
      if (note.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta anotação'
        });
      }
      
      
      const updatedNote = await NoteService.updateNote(id, {
        title: title || note.title,
        content: content || note.content,
        tags: tags || note.tags,
        favorite: favorite !== undefined ? favorite : note.favorite,
        metadata: {
          ...note.metadata,
          ...metadata,
          updatedAt: new Date()
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Anotação atualizada com sucesso',
        data: updatedNote
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar anotação',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
 
  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      
      const note = await NoteService.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }
      
      
      if (note.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta anotação'
        });
      }
      
      
      await NoteService.deleteNote(id);
      
      return res.status(200).json({
        success: true,
        message: 'Anotação excluída com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir anotação',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getUserNoteStats(req, res) {
    try {
      const userId = req.user.id;
      
      const stats = await NoteService.getUserStats(userId);
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  }
};

export default NoteController;
