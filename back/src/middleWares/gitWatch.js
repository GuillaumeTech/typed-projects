import {listTasksToWatch} from './tasks'
const { Octokit } = require("@octokit/rest");
import projects from '../models/projects.js';


function updateIfneeded(task, listOpenPR, listRecentlyClosedPR){

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
        const listRecentlyClosedPR = await octokit.search.code({
            q: 'type:pr is:merged',
          });
        // console.log('open', listOpenPR)
          
        console.log('open', listOpenPR.data[0].head.ref)
        // console.log('closed', listRecentlyClosedPR)
        // tasks.map((task)=>updateIfneeded(task,listOpenPR, listRecentlyClosedPR))
    },10000)    
}


