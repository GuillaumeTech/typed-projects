import React  from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Card} from 'semantic-ui-react'
export function Task({name, status, points, description}) {

    return (<Card
        header={name}
        meta={status}
        description={description}
        // extra={}
      />);
}