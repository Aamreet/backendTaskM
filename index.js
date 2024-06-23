
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Assuming your Mongoose model is defined in Task.js
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// GET route for testing
app.get('/', (req, res) => {
  res.send("Hello World");
});

// GET route to submit form data
app.post('/createTask', async (req, res) => {
  const { title, description, dueDate } = req.body;
  let newTask = await Task.create({
    title,
    description,
    dueDate
  });
  res.send(newTask);
});

app.get('/getTask', async (req, res) => {
  let taskList = await Task.find();
  res.send(taskList);
});

app.get('/getTask/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const trimmedTitle = title.trim(); // Trim leading/trailing spaces

    const task = await Task.findOne({ title: { $regex: new RegExp(`^${trimmedTitle}$`, 'i') } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/deleteTask/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).send('Task deleted successfully');
  } catch (error) {
    res.status(500).send('Failed to delete task');
  }
});

app.put('/updateTask/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body; // Assuming the body contains the updated task data

  try {
    // Use findOneAndUpdate to update the task in the database
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, updatedTaskData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated data against the schema
    });

    if (!updatedTask) {
      return res.status(404).send('Task not found');
    }

    res.status(200).json(updatedTask); // Respond with the updated task
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
