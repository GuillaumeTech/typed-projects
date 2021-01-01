import React, { useState, useEffect } from 'react';
import { fetchBackend } from '../utils/fetchWrapper';
import 'semantic-ui-css/semantic.min.css';
import { ProjectContext } from '../contexts/ProjectContext';

import { safeLoad } from 'js-yaml'
import { Column } from './Column'
import { Menu, Input } from 'semantic-ui-react'

export const Project = ({ projectId }) =>{

    const [tasks, setTasks] = useState({});
    const [politic, setPolitic] = useState([]);

    useEffect(() => {

        const getData = async () => {
            const tasks = await fetchTasks(projectId)
            const {politic} = await fetchPolitic(projectId)
            setTasks(tasks)
            setPolitic(safeLoad(politic))
        }

        getData()
    }, [])

    async function fetchTasks(projectId) {
        const data = await fetchBackend(`/tasks/list/${projectId}`)
        return data
    }

    async function fetchPolitic(projectId) {
        const data = await fetchBackend(`/project/politic/${projectId}`)
        console.log(data)
        return data
    }

    function addTask(task) {
        console.log('add')
    }

    function deleteTask(id) {
        console.log('del')

    }

    function updateTask(id, task) {
        console.log('up')

    }

    function listColumns(parsedPolitic) {
        return parsedPolitic.map(({ stepName }) => stepName)
    }

    return (<ProjectContext.Provider
        value={{
            tasks,
            politic,
            addTask,
            deleteTask,
            updateTask
        }}>
        <Menu secondary>
            <Menu.Item
                name='Project name'
            />
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='add' placeholder='Add a task...' />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
        <div className="columns-container">
            {listColumns(politic).map(name => (<Column name={name} />))}
        </div>

    </ProjectContext.Provider>);
}