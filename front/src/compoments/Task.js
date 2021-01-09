import React, { useState, useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Modal, Icon } from "semantic-ui-react";
import {
  AutoForm,
  AutoField,
  LongTextField,
  NumField,
  SubmitField,
  ErrorsField,
} from "uniforms-semantic";
import { ProjectContext } from "../contexts/ProjectContext";

export function Task(props) {
  const { display, task, nextColumnRequirements } = props;
  const { name, _id } = task;

  const [modalOpen, setModalOpen] = useState(false);
  const { schemaBridge, politic, updateTask, deleteTask, projectId } = useContext(
    ProjectContext
  );

  function pickFieldCompoment(field) {
    switch (field.type) {
      // no check on  the string type beacuse it is the deafault one
      case "Text":
        return <LongTextField name={field.name} key={field.name} />;
      case "Number":
        return <NumField name={field.name} key={field.name} />;
      default:
        return <AutoField name={field.name} key={field.name} />;
    }
  }

  function computeRequiredForNext(task, required) {
    const missing = [];
    required.forEach((key) => {
      if (task[key]) return;
      missing.push(key);
    });
    if (missing.length > 0) return "next: " + missing.join(", ");
    return "";
  }

  function renderRequiredForNext() {
    const missingFields = computeRequiredForNext(
      task,
      nextColumnRequirements
    );
    if (missingFields)
      return <Modal.Actions>{missingFields}</Modal.Actions>;
    return 
  }

  function renderEdit() {
    return (
      <Modal
        open={modalOpen}
        closeIcon
        onClose={() => setModalOpen(false)}
        onOpen={() => setModalOpen(true)}
        trigger={
          <Button floated="right" size="tiny">
            Edit
          </Button>
        }
      >
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content>
          <AutoForm
            schema={schemaBridge}
            model={task}
            onSubmit={(newTask) => {
              updateTask(projectId, _id, newTask);
              setModalOpen(false);
            }}
          >
            {politic.reduce((all, step) => {
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
            }, [])}
            <ErrorsField />

            <SubmitField />
          </AutoForm>
        </Modal.Content>
        {renderRequiredForNext()}
      </Modal>
    );
  }

  function displayText(desc = "") {
    if (desc.length > 100) return desc.slice(0, 100) + "...";
    return desc;
  }
  return (
    <>
      <Card>
        <Card.Content>
          <Button floated="right" icon="trash" basic size="tiny" onClick={()=>deleteTask(_id)} />
          {renderEdit()}
          <Card.Header>{name}</Card.Header>
          <Card.Meta></Card.Meta>
          {/* make it so description is gen */}
          {/* info/display here ? */}
          <Card.Description>user machin</Card.Description>
        </Card.Content>
        {display && (
          <Card.Content extra>
            {display
              .map((field) => {
                if (task[field]) return `${field}: ${task[field]}`;
                return "";
              })
              .join(", ")}
          </Card.Content>
        )}
      </Card>
    </>
  );
}
