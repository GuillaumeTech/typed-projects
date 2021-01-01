import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import asyncify from 'express-asyncify'
import mongoose from 'mongoose';
import { createTask, updateTask, deleteTask, listTasks, getTask } from './middleWares/tasks'
import { getPolitic } from './middleWares/projects'


const app = asyncify(express());

app.use(cors());
app.use(express.json());
app.use(logger('dev') );
app.use(cookieParser())
mongoose.connect('mongodb://root:tNomeeroZLbx@localhost:27017/typed?authSource=admin', {useNewUrlParser: true});


app.post('/task/create/:projectId', async (req, res) => {
  const { body: task } = req
	const {projectId} = req.params;
  try {
    const createdTask = await createTask( projectId, task); 
    res.status(201).send(createdTask)
  } catch (e){
    console.log(e)
	  res.status(400).send({
      message: 'Could not create task'
   });
  }
});

app.post('/task/update/:projectId/:id', async (req, res) => {
  const { body: taskUpdate } = req
  console.log(taskUpdate)
	const {id, projectId} = req.params;
  try {
    const updatedTask = await updateTask(projectId, id, taskUpdate); 
    res.send(updatedTask)
  } catch (e){
    console.log(e)
	  res.status(400).send({
      message: 'Could not update task'
   });
  }
});

app.delete('/task/delete/:id', async (req, res) => {
	const {id} = req.params;
  try {
    const deletedId = await deleteTask(id); 
    res.send(deletedId)
  } catch (e){
	  res.status(400).send({
      message: 'Could not delete task'
   });
  }
});

app.get('/tasks/list/:projectId', async (req, res) => {
  const {projectId} = req.params;
  try {
    const taskList = await listTasks(projectId); 
    res.send(taskList)
  } catch (e){
	  res.status(400).send({
      message: 'Could not get task list'
   });
  }
});


app.get('/task/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const task = await getTask(id); 
    res.send(task)
  } catch (e){
	  res.status(400).send({
      message: 'Could not get task'
   });
  }
});



app.get('/project/politic/:projectId', async (req, res) => {
  const {projectId} = req.params;
  try {
    const politic = await getPolitic(projectId); 
    res.send({politic})
  } catch (e){
    console.log(e)
	  res.status(400).send({
      message: 'Could not get politic'
   });
  }
});


app.listen(process.env.PORT, () =>
  console.log(`Task list server listening on ${process.env.PORT}!`),
);
