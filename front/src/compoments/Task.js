import React, { useState, useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Modal, Header } from "semantic-ui-react";
import { AutoForm } from 'uniforms-semantic';
import {ProjectContext} from '../contexts/ProjectContext'

export function Task({ name, status, points, description, _id }) {
  const [modalOpen, setModalOpen] = useState(false);
  const {schemaBridge} = useContext(ProjectContext);


  function renderEdit() {
    return (
      <Modal
        open={modalOpen}
        closeIcon
        onClose={() => setModalOpen(false)}
        onOpen={() => setModalOpen(true)}
        trigger={<Button size='tiny'>Edit</Button>}
      >
       <AutoForm schema={schemaBridge} onSubmit={(a)=>console.log('a',a)} />
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
