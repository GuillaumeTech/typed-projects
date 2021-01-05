import React, { useState, useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Modal } from "semantic-ui-react";
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
  const { name, status, points, description, _id }= props
  const [modalOpen, setModalOpen] = useState(false);
  const { schemaBridge, politic,  } = useContext(ProjectContext);

  function pickFieldCompoment(field) {
    switch (field.type) {
      // no check on  the string type beacuse it is the deafault one
      case "Text":
        return <LongTextField name={field.name} key={field.name} />;
      case "Number":
        return <NumField name={field.name} key={field.name}/>;
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
        trigger={<Button size="tiny">Edit</Button>}
      >
        <AutoForm schema={schemaBridge} model={props} onSubmit={(a) => console.log("a", a)}>
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

        {/* <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>
              We've found the following gravatar image associated with your
              e-mail address.
            </p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black">Nope</Button>
          <Button
            content="Yep, that's me"
            labelPosition="right"
            icon="checkmark"
            positive
          />
        </Modal.Actions> */}
      </Modal>
    );
  }

  return (
    <>
      <Card
        header={name}
        meta={status}
        description={description}
        extra={renderEdit()}
      />
    </>
  );
}
