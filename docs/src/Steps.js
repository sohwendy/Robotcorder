import React from 'react';
import './Steps.css';
import { Icon, Step, Container, Header } from 'semantic-ui-react';

const RobotStep = ({step}) => (
  <Step>
    <Icon name={step.name} style={{ 'color': '#E16F6F' }} />
    <Step.Content >
      <Step.Title>{step.title}</Step.Title>
      <Step.Description>{step.desc}</Step.Description>
    </Step.Content>
  </Step>
);

const STYLE = {
  desktop: {
    'fontSize': '2em',
    'marginBottom': '1.33em',
  },
  mobile: {
    'fontSize': '1.5em',
    'marginBottom': '0'
  }
};

const Steps = ({ content, screen }) => (
  <Container>
    <Header
      as='h2'
      textAlign={'center'}
      inverted
      style={STYLE[screen]} >
      { content.title }
    </Header>
    <Step.Group widths={4} size='large'>
      { content.description.map((step, i) => <RobotStep key={i} step={step} />) }
    </Step.Group>
  </Container>
);

export default Steps;
