import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const STYLE = {
  desktop: {
    header: {
      fontSize: '2em',
      textAlign: 'center',
      margin: '1em 0'
    },
    content: {
      fontSize: '1.33em',
      textAlign: 'left',
      marginLeft: '1.5em'
    }
  },
  mobile: {
    header: {
      fontSize: '1.5em',
      textAlign: 'center',
      margin: '0em 0em 1em 0em'
    },
    content: {
      fontSize: '1em',
      textAlign: 'left',
    }
  }
};

const Info = ({ content, screen }) => (
  <Container text style={{ padding: '' }}>
    <Header as='h2' style={ STYLE[screen].header } >
      { content.title }
    </Header>
    { content.description.map((a,i) => <p key={i} style={ STYLE[screen].content }>{a}</p>) }
  </Container>
);

export default Info;
