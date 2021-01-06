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
  const { name, status, points, priority,description, _id } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const { schemaBridge, politic, updateTask, projectId } = useContext(
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

  function renderEdit() {
    return (
      <Modal
        open={modalOpen}
        closeIcon
        onClose={() => setModalOpen(false)}
        onOpen={() => setModalOpen(true)}
        trigger={<Button floated='right' size="tiny">Edit</Button>}
      >
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content>
          <AutoForm
            schema={schemaBridge}
            model={props}
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
      </Modal>
    );
  }

  function displayText(desc = ''){
    if( desc.length > 100) return description.slice(0,100) + '...';
    return description
  }
  return (
    <>
      <Card>
        <Card.Content>
        <Button floated="right" icon="trash" basic size='tiny'/>
        {renderEdit()}
          <Card.Header>{name}</Card.Header>
          <Card.Meta>{status}</Card.Meta>
        {/* make it so description is gen */}
{/* info/display here ? */}
          <Card.Description>{displayText(description)}</Card.Description>
        </Card.Content>
        {/* make it so extra is gen from display property */}
        {/* users here ? */}
        <Card.Content extra>{priority}</Card.Content> 
      </Card>
    </>
  );
}
