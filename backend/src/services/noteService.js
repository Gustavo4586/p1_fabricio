import mongoose from 'mongoose';
import  Note  from '../models/mongoModels.js';


const NoteService = {
  
  async getNoteById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await Note.findById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar anotação: ${error.message}`);
    }
  },
  
  
  async updateNote(id, noteData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const note = await Note.findByIdAndUpdate(
        id,
        { $set: noteData },
        { new: true }
      );
      
      return note;
    } catch (error) {
      throw new Error(`Erro ao atualizar anotação: ${error.message}`);
    }
  },
  
  
  async deleteNote(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const note = await Note.findById(id);
      if (!note) {
        return false;
      }
      
      
      await this.updateNoteStats(note.userId, note.courseId, -1);
      
      await Note.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir anotação: ${error.message}`);
    }
  }
};

export default NoteService;
