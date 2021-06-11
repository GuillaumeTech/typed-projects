
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


function handlePR(body, projectId){
	const {action, pull_request} = body
	switch(action){
		case 'closed':
		case 'locked':
			// if + merge next step
		break;
		case 'ready_for_review':
		case 'opened':
		case  'review_requested': 
			// if not a draft move to next step
		break;
                case 'closed':

		break;

	}

}

function handleReview(body, projectId){}

function handlePush(body, projectId){}











