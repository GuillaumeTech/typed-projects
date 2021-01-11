import {listTasksToWatch} from './tasks'
 

const octokit = new Octokit({ auth: `personal-access-token123` });

await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'octocat',
    repo: 'hello-world'
  })
function updateIfneeded(task, listOpenPR, listRecentlyClosedPR){

}


export function startGitWatch(){
    getGitInfo()
    setInterval(()=>{
        const tasks = listTasksToWatch();
        const listOpenPR = gittruc
        const listRecentlyClosedPR = gittruc
        tasks.map((task)=>updateIfneeded(task,listOpenPR, listRecentlyClosedPR))
    },30000)    
}


