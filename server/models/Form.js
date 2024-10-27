import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'multipleChoice', 'checkbox'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [optionSchema]
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [questionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Form', formSchema);