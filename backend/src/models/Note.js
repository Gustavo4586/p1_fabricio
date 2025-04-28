import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    ref: 'User' 
  },
  courseId: {
    type: Number,
    required: true,
    ref: 'Course' 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  favorite: {
    type: Boolean,
    default: false
  },
  
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lessonNumber: {
      type: Number,
      default: 1
    },
    lessonTitle: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#ffffff'
    }
  }
}, {
  timestamps: true
});





NoteSchema.pre('save', function(next) {
  this.metadata.updatedAt = Date.now();
  next();
});


const Note = mongoose.model('Note', NoteSchema);

export default Note;

