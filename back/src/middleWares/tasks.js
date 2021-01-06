import tasks from '../models/tasks.js';
import projects from '../models/projects.js';
import { safeLoad } from 'js-yaml';

export async function createTask(projectId, task) {
  if (!task.name) throw new Error();
  const { politic } = await projects.findOne({ _id: projectId });
  const newStatus = statusCompute(politic, task);
  return tasks.create({ projectId, ...task, status: newStatus });
}

export async function updateTask(projectId, id, taskUpdate) {
  const newTask = await tasks
    .findOneAndUpdate({ _id: id }, taskUpdate, { new: true })
    .lean();
  const { politic } = await projects.findOne({ _id: projectId });
  const newStatus = statusCompute(politic, newTask);
  return await tasks
    .findOneAndUpdate(
      { _id: id },
      { ...taskUpdate, projectId, status: newStatus },
      { new: true },
    )
    .lean();
}

export async function deleteTask(_id) {
  return tasks.remove({ _id });
}

export async function listTasks(projectId) {
  return tasks.find({ projectId }).lean();
}

export async function getTask(_id) {
  return tasks.findOne({ _id }).lean();
}

function statusCompute(politic, taskUpdate) {
  const parsedPolitic = safeLoad(politic);
  console.log(parsedPolitic);
  let status = '';
  for (let step of parsedPolitic) {
    const { stepName, fields } = step;
    if (
      fields.every((field) => {
        if (typeof field === 'string') {
          return taskUpdate[field];
        } else {
          return taskUpdate[field.name];
        }
      })
    ) {
      status = stepName;
    } else {
      break;
    }
  }
  return status;
}
