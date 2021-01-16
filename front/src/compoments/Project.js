import React, { useState, useEffect } from "react";
import { fetchBackend } from "../utils/fetchWrapper";
import "semantic-ui-css/semantic.min.css";
import { ProjectContext } from "../contexts/ProjectContext";
import { generateSimpleSchema, projectSchema } from "../utils/simpleSchema";
import { safeLoad } from "js-yaml";
import { Column } from "./Column";
import { Menu, Input, Button, Form, Modal } from "semantic-ui-react";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import { AutoForm, AutoField, LongTextField, ErrorsField, SubmitField, NumField} from  "uniforms-semantic";


export const Project = ({ projectId }) => {
  const [tasks, setTasks] = useState({});
  const [schemaBridge, setSchemaBridge] = useState({});
  const [taskForm, setTaskForm] = useState([]);


  const [project, setProject] = useState({});
  const [newTaskName, setNewTaskName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);


  useEffect(() => {
    const getData = async () => {
      const tasks = await fetchTasks(projectId);
      const { politic, ...rest } = await fetchProject(projectId);
      const parsedPolitic = safeLoad(politic);
      setTasks(tasks);
      setProject({ parsedPolitic, politic,  ...rest });
      setTaskForm(generateTaskForm(parsedPolitic))
      setSchemaBridge(
        new SimpleSchema2Bridge(generateSimpleSchema(parsedPolitic))
      );
    };

    getData();
  }, []);




  function generateTaskForm(aPolitic) {
    return aPolitic.reduce((all, step) => {
      const newCompoments = step.fields.map((field) => {
        let fieldObj = { type: "String" };
        if (typeof field === "string") {
          fieldObj.name = field;
        } else {
          fieldObj.name = field.name;
          // deafult to String
          fieldObj.type = field.type || fieldObj.type;
        }
        return pickFieldCompoment(fieldObj);
      });
      return [...all, ...newCompoments];
    }, [])
  }

  function pickFieldCompoment(field) {
    switch (field.type) {
      case "Text":
        return <LongTextField name={field.name} key={field.name} />;
      case "Number":
        return <NumField name={field.name} key={field.name} />;
      default:
        return <AutoField name={field.name} key={field.name} />;
    }
  }

  async function fetchTasks(projectId) {
    const data = await fetchBackend(`/tasks/list/${projectId}`);
    return data;
  }

  async function fetchProject(projectId) {
    const {project} = await fetchBackend(`/project/${projectId}`);
    return project;
  }

  async function updateProjectSetings(projectId, project) {
    const data = await fetchBackend(`/project/update/${projectId}`, {
      body: project,
    });
    const { politic, ...rest } = data
    const parsedPolitic = safeLoad(politic);
    setSchemaBridge(
      new SimpleSchema2Bridge(generateSimpleSchema(parsedPolitic))
    );
    setTaskForm(generateTaskForm(parsedPolitic))
    setProject({ parsedPolitic, politic,  ...rest });
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
            schema={ new SimpleSchema2Bridge(projectSchema)}
            model={project}
            onSubmit={(newSettings) => {
              updateProjectSetings(projectId, newSettings);
              setSettingsOpen(false);
            }}
          >

        <AutoField name='name' key='name' />

        <LongTextField name='politic' key='politic' />
   
        <AutoField name='authToken' key='authToken' />


     
        <AutoField name='repo' key='repo' />
           
        <ErrorsField />

<SubmitField />
          </AutoForm>
        </Modal.Content>
        
      </Modal>
    );
  }

  function listColumns(parsedPolitic) {
    return
  }

  return (
    <ProjectContext.Provider
      value={{
        tasks,
        politic: project.parsedPolitic,
        schemaBridge,
        taskForm,
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
        <Menu.Item >
        {renderSettings()}
        </Menu.Item  >
          <Menu.Item name={project.name} />
        </Menu.Menu>
      </Menu>
      <div className="columns-container">
        { project.parsedPolitic && project.parsedPolitic.map(({ stepName, display }) =>  (
          <Column key={stepName} name={stepName} display={display} />
        ))}
      </div>
    </ProjectContext.Provider>
  );
};
