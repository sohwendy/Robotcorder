import React from 'react';
import { Container } from 'semantic-ui-react';

const Notice = ({ content }) => (
  <Container text textAlign='center'>
    <p style={{ fontSize: '1.33em', fontStyle: 'italic'}} >{content}</p>
  </Container>
);

export default Notice;
