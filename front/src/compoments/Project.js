import React, { useState, useEffect } from "react";
import { fetchBackend } from "../utils/fetchWrapper";
import "semantic-ui-css/semantic.min.css";
import { ProjectContext } from "../contexts/ProjectContext";
import { generateSimpleSchema } from "../utils/genSimpleSchema";
import { safeLoad } from "js-yaml";
import { Column } from "./Column";
import { Menu, Input, Button, Form } from "semantic-ui-react";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
export const Project = ({ projectId }) => {
  const [tasks, setTasks] = useState({});
  const [schemaBridge, setSchemaBridge] = useState({});

  const [politic, setPolitic] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const tasks = await fetchTasks(projectId);
      const { politic } = await fetchPolitic(projectId);
      const parsedPolitic = safeLoad(politic);
      setTasks(tasks);
      setPolitic(parsedPolitic);
      console.log(new SimpleSchema2Bridge())
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

  async function fetchPolitic(projectId) {
    const data = await fetchBackend(`/project/politic/${projectId}`);
    return data;
  }

  async function addTask(task) {
    const data = await fetchBackend(`/task/create/${projectId}`, {
      body: task,
    });
    setTasks([...tasks, data]);
  }

  function deleteTask(id) {
    console.log("del");
  }

  function updateTask(id, task) {
    console.log("up");
  }

  function listColumns(parsedPolitic) {
    return parsedPolitic.map(({ stepName }) => stepName);
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
        {listColumns(politic).map((name) => (
          <Column key={name} name={name} />
        ))}
      </div>
    </ProjectContext.Provider>
  );
};
