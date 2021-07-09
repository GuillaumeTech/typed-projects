
import { updateTask } from './middleWares/tasks'
import tasks from '../models/tasks.js';

export function handleGitWebhookData(body, type, projectId) {
	switch(type){
		case 'pull_request':
			handlePR(body, projectId);
		break;
		case 'pull_request_review':
			handleReview(body, projectId);
		break;
		case: 'push':
			handlePush(body, projectId);
		break;
		default:
			throw new Error(`event type ${type} not supported`); 
	}
	return
}


function async handlePR(body, projectId){
	const {action, pull_request} = body
	const branch = pull_request?.head?.ref	
	const task = await tasks.find({branch});
	switch(action){
		case 'closed':
			// for good measure we re-update the pr value
			const newTask = {...task, pr: pull_request.url, merged: pull_request.merged}
			await updateTask(task.projectId, task._id, newTask)
			// if + merge next step
		break;
		case 'ready_for_review':
		case 'opened':
		case 'review_requested':
			if(!pull_request.draft){
				const newTask = {...task, pr: pull_request.url,}
				await updateTask(task.projectId, task._id, newTask)
			} 
		break;
		case: 'converted_to_draft':
			const newTask = {...task, pr: undefined } 
			await updateTask(task.projectId, task._id, newTask)
		break;

	}

}


// maybe some fancy stuff to do here
function handleReview(body, projectId){
	return undefined
}

// auto create task is branch does not exist
function handlePush(body, projectId){
}











