// models/Task.js (create a file for your schema)
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/taskMgr');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
