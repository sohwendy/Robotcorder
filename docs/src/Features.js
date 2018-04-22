import React from 'react';
import './Features.css';
import { Card, Container, Divider } from 'semantic-ui-react';

const RobotCard = (props) => (
  <Card
    header={props.header}
    description={props.description}
    extra={props.extra()}
  />
);

const Features = ({ content }) => (
  <Container text style={{marginTop: '2em', marginBottom: '2em'}}>
    <Divider
      as='h4'
      className='header'
      horizontal
      style={{ margin: '3em 0em', textTransform: 'uppercase' }}
     >
     { content.title }
    </Divider>

    <Card.Group centered>
      { content.description.map((column, i) => <RobotCard key={i} {...column} />) }
    </Card.Group>
  </Container>
);

export default Features;
