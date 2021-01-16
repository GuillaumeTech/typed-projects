import projects from '../models/projects.js';

export async function getProject(projectId) {
  const project = await projects.findOne({ _id: projectId });
  return project
}


export async function updateProject(id, project) {
 return await projects
    .findOneAndUpdate({ _id: id }, project, { new: true })
    .lean();
}