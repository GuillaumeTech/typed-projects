import React, { useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import { ProjectContext } from "../contexts/ProjectContext";
import { Header } from "semantic-ui-react";
import { Task } from "./Task";

export function Column({ name, display }) {
  const { tasks, politic } = useContext(ProjectContext);

  function filterTasks() {
    return tasks.filter(({ status }) => status === name);
  }

  function nextColumnRequirements(step, parsedPolitic) {
    const currentStep = parsedPolitic.findIndex(
      ({ stepName }) => stepName === step
    );
    if (currentStep + 1 === parsedPolitic.length) return []; //last step do not have requirements
    return parsedPolitic[currentStep + 1].fields.map((field) => {
      if (typeof field === "string") return field;
      return field.name;
    });
  }

  return (
    <>
      <div className="column">
        <Header size="medium">{name}</Header>

        {filterTasks().map((task) => (
          <Task
            task={task}
            key={task._id}
            display={display}
            nextColumnRequirements={nextColumnRequirements(name, politic)}
          />
        ))}
      </div>
    </>
  );
}
