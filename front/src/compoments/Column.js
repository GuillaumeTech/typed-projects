import React, {  useContext } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ProjectContext } from '../contexts/ProjectContext';
import {Header } from 'semantic-ui-react'
import { Task } from './Task'

export function Column({ name }) {

    const {tasks} = useContext(ProjectContext);


    function filterTasks() {
       return tasks.filter(({status}) => status === name)
    }


    return (
       <>
    <div className='column'>
    <Header size='medium'>{name}</Header>

       { filterTasks().map(task => <Task {...task} key={task._id} />)}
        </div>
        </>);
}