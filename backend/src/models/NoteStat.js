import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const NoteStatSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
    ref: 'User' 
  },
  totalNotes: {
    type: Number,
    default: 0
  },
  notesByCourse: [{
    courseId: {
      type: Number,
      ref: 'Course' 
    },
    courseName: String,
    count: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  favoriteCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});





const NoteStat = mongoose.model('NoteStat', NoteStatSchema);


export default NoteStat;

