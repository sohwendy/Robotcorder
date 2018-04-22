import React from 'react';
import { Card, Header, Container } from 'semantic-ui-react';

const Statement = ({code, screen}) => (
  <p>
    <code style={ STYLE[screen].code } >
      {code}
    </code>
  </p>
);

const STYLE = {
  desktop: {
    header: {
      marginTop: '3em',
      color: 'white',
      fontSize: '1.5em'
    },
    content: {
      padding: '3em 4em 3em 4em'
    },
    code: {
      fontSize: '1.33em',
      lineHeight: '2em'
    }
  },
  mobile: {
    header: {
      marginTop: '3em',
      color: 'white',
      fontSize: '1em'
    },
    content: {
      padding: '1em 1em 1em 1em'
    },
    code: {
      fontSize: '0.7em',
      lineHeight: '2em'
    }
  }
}

const Code = ({ content, screen }) => (
  <Container text>
    <Header as='h3' textAlign='center' style={ STYLE[screen].header } >
      { content.title }
    </Header>

    <Card fluid style={{
      marginTop: '1em',
      borderRadius: '0px',
      background: '#37474f',
      border: '1px solid',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap'
    }} >
      <Card.Content style={ STYLE[screen].content } >
        {content.description.map((c, i) => <Statement key={i} code={c} screen={screen} />)}
      </Card.Content>
    </Card>
  </Container>
);

export default Code;
