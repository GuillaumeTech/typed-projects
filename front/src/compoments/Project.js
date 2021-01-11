import React, { useState, useEffect } from "react";
import { fetchBackend } from "../utils/fetchWrapper";
import "semantic-ui-css/semantic.min.css";
import { ProjectContext } from "../contexts/ProjectContext";
import { generateSimpleSchema, projectSchema } from "../utils/simpleSchema";
import { safeLoad } from "js-yaml";
import { Column } from "./Column";
import { Menu, Input, Button, Form, Modal } from "semantic-ui-react";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";



export const Project = ({ projectId }) => {
  const [tasks, setTasks] = useState({});
  const [schemaBridge, setSchemaBridge] = useState({});
  const [politic, setPolitic] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);


  useEffect(() => {
    const getData = async () => {
      const tasks = await fetchTasks(projectId);
      const { politic } = await fetchPolitic(projectId);
      const parsedPolitic = safeLoad(politic);
      setTasks(tasks);
      setPolitic(parsedPolitic);
      setSchemaBridge(
        new SimpleSchema2Bridge(generateSimpleSchema(parsedPolitic))
      );
    };

    getData();
  }, []);

  async function fetchTasks(projectId) {
    const data = await fetchBackend(`/tasks/list/${projectId}`);
    return data;
  }

  async function fetchProject(projectId) {
    const data = await fetchBackend(`/project/${projectId}`);
    return data;
  }

  async function updateProjectSetings(projectId, project) {
    const data = await fetchBackend(`/project/update/${projectId}`, {
      body: project,
    });
   
   const updatedIndex = tasks.findIndex(task => task._id === data._id)
   setTasks([...tasks.slice(0, updatedIndex), data,...tasks.slice( updatedIndex+1) ])
  }


  async function addTask(task) {
    const data = await fetchBackend(`/task/create/${projectId}`, {
      body: task,
    });
    setTasks([...tasks, data]);
  }

  async function deleteTask(id) {
    const toBeDeletedIndex = tasks.findIndex(task => task._id === id)
    const data = await fetchBackend(`/task/delete/${id}` ,{method: 'DELETE'});
    if(data.deletedCount === 1) setTasks([...tasks.slice(0, toBeDeletedIndex),...tasks.slice( toBeDeletedIndex+1) ])
  }

  async function updateTask(projectId, id, task) {
    const data = await fetchBackend(`/task/update/${projectId}/${id}`, {
      body: task,
    });
   
   const updatedIndex = tasks.findIndex(task => task._id === data._id)
   setTasks([...tasks.slice(0, updatedIndex), data,...tasks.slice( updatedIndex+1) ])
  }


  function renderSettings() {
    return (
      <Modal
        open={settingsOpen}
        closeIcon
        onClose={() => setSettingsOpen(false)}
        onOpen={() => setSettingsOpen(true)}
        trigger={
          <Button floated="right" size="tiny">
            Settings
          </Button>
        }
      >
        <Modal.Header>Settings</Modal.Header>
        <Modal.Content>
          <AutoForm
            schema={projectSchema}
            model={projectSchema}
            onSubmit={(newSettings) => {
              updateProjectSetings(projectId, newSettings);
              setSettingsOpen(false);
            }}
          >
           
          </AutoForm>
        </Modal.Content>
        
      </Modal>
    );
  }


  // name: String,
  // politic: String,
  // authToken: String,
  // repo: String,
  function listColumns(parsedPolitic) {
    return
  }

  return (
    <ProjectContext.Provider
      value={{
        tasks,
        politic,
        schemaBridge,
        addTask,
        deleteTask,
        updateTask,
        projectId,
      }}
    >
      <Menu secondary>
        <Menu.Item>
          <Form
            onSubmit={() => {
              addTask({ name: newTaskName });
              setNewTaskName("");
            }}
          >
            <Input
              type="text"
              value={newTaskName}
              placeholder="Create a task..."
              action
              onChange={(_, { value }) => {
                setNewTaskName(value);
              }}
            >
              <input />

              <Button type="submit">Create</Button>
            </Input>
          </Form>
        </Menu.Item>
        <Menu.Menu position="right">
          
          <Menu.Item name="Project name" />
        </Menu.Menu>
      </Menu>
      <div className="columns-container">
        { politic.map(({ stepName, display }) =>  (
          <Column key={stepName} name={stepName} display={display} />
        ))}
      </div>
    </ProjectContext.Provider>
  );
};
