import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import asyncify from 'express-asyncify'
import mongoose from 'mongoose';
import { createTask, updateTask, deleteTask, listTasks, getTask } from './middleWares/tasks'
import { getProject, updateProject } from './middleWares/projects'
import { startGitWatch } from './middleWares/gitWatch'
import sdk from 'node-appwrite'



async function init() {

let client = new sdk.Client();

let database = new sdk.Database(client);




client
    .setEndpoint('http://localhost/v1') // Your API Endpoint
    .setProject('60b4040f9445d') // Your project ID
    .setKey('6eb36e1a091efaac9b632420b2b501fe9fe953efd50c101004a5e47913558027a7c9a440aa9cac8b158cf94d3e644b038f7260a8af30edd7c079f02a1cd46d5e22a5132545081c291df36dc4da923cea2d9f4bad76d8d23bd44e02e7ff18a2667d6c1972c7f14bbc2675904415a72bc1fa2627bde0964bbd4b30bf513af221b6');


try {

   await database.createCollection('projects', ['*'], ['*'], [
      { label: 'Name', key: 'name', type: 'text', default: '', required: true, array: false },
      { label: 'Politic', key: 'politic', type: 'text', default: '', required: true, array: false }
      { label: 'AuthToken', key: 'authToken', type: 'text', default: '', required: true, array: false } 
      { label: 'Repo', key: 'repo', type: 'text', default: '', required: true, array: false } 
    ]);


   await database.createCollection('tasks', ['*'], ['*'], [
      { label: 'Name', key: 'name', type: 'text', default: '', required: true, array: false },
      { label: 'Status', key: 'politic', type: 'text', default: '', required: true, array: false }
      { label: 'AuthToken', key: 'authToken', type: 'text', default: '', required: true, array: false } 
      { label: 'Repo', key: 'repo', type: 'text', default: '', required: true, array: false } 
    ]);
}catch (e) {
	console.log(e) }

}

init()
const app = asyncify(express());




app.use(cors());
app.use(express.json());
app.use(logger('dev') );
app.use(cookieParser())
//mongoose.connect('mongodb://root:tNomeeroZLbx@localhost:27017/typed?authSource=admin', {useNewUrlParser: true});
//startGitWatch('test')

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



app.get('/project/:projectId', async (req, res) => {
  const {projectId} = req.params;
  try {
    const project = await getProject(projectId); 
    res.send({project})
  } catch (e){
    console.log(e)
	  res.status(400).send({
      message: 'Could not get project'
   });
  }
});



app.post('/project/update/:projectId', async (req, res) => {
  const { body: project } = req
	const {projectId} = req.params;
  try {
    const updatedProject = await updateProject(projectId, project); 
    res.send(updatedProject)
  } catch (e){
    console.log(e)
	  res.status(400).send({
      message: 'Could not update project'
   });
  }
});



app.listen(process.env.PORT, () =>
  console.log(`Task list server listening on ${process.env.PORT}!`),
);
