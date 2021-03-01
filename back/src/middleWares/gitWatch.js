import {listTasksToWatch} from './tasks'
const { Octokit } = require("@octokit/rest");
import projects from '../models/projects.js';


function updateIfneeded(task, listOpenPR, listRecentlyClosedPR){
  const { branch, pr, _prNumber } = task
  if (!_prNumber){
    const correspondingPR = listOpenPR.find( pr => pr.branch === branch))
    if(correspondingPR){
      return tasks.update( _prNumber)
    }
  }

  

}


export async function startGitWatch(projectId){
    const {authToken, repo} = await projects.findOne({ _id: projectId}).lean()
    const [owner, reponame] = repo.split('/')
    const octokit = new Octokit({ auth: authToken });
  
    setInterval(async ()=>{
        const tasks = await listTasksToWatch(projectId);
        // no need to query github if there is none to watch
        if (tasks.length === 0) return

        const listOpenPR = await octokit.pulls.list({
            owner,
            repo: reponame,
            state: 'open'
          });
        const listRecentlyClosedPR = await octokit.search.issuesAndPullRequests({
            q: `type:pr is:merged repo:${repo}`,
          });
        const openPrBranches = listOpenPR.data.map(pr =>( {branch: pr.head.ref, number: pr.number}))
console.log(listRecentlyClosedPR.data.items)
        const closedPR = listRecentlyClosedPR.data.items.map(pr => pr.number)
        // await Promise.all(tasks.map((task)=>updateIfneeded(task,openPrBranches, closedPR)))
    },10000)    
}


