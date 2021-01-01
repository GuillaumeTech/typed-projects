import projects from '../models/projects.js';

export async function getPolitic(projectId) {
  const {politic} =  await projects.findOne({ _id: projectId });
  return politic
}
