import React, {  useContext } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ProjectContext } from '../contexts/ProjectContext';

import { Task } from './Task'

export function Column({ name }) {

    const {tasks} = useContext(ProjectContext);


    function filterTasks() {
       console.log('name', name)
       console.log('task', tasks)
       return tasks.filter(({status}) => status === name)
    }


    return (<div className='column'>
       { filterTasks().map(task => <Task {...task} />)}
        </div>);
}