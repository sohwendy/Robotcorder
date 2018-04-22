import PropTypes from 'prop-types'
import React from 'react';
import logo from './assets/logo-128.svg';
import './Heading.css';
import { Container, Header, Image, List, Button, Icon } from 'semantic-ui-react';


const STYLE = {
  desktop: {
    h1: {
      fontSize: '4em',
      fontWeight: 'normal',
      marginBottom: 0,
      marginTop: '2em'
    },
    h2: {
      fontSize: '1.7em',
      fontWeight: 'normal',
      marginTop: '1.5em'
    }
  },
  mobile: {
    h1: {
      fontSize: '2em',
      fontWeight: 'normal',
      marginBottom: 0,
      marginTop: '0'
    },
    h2: {
      fontSize: '1.5em',
      fontWeight: 'normal',
      marginTop: '0.5em'
    }
  }
};

const Heading = ({ screen, content, badges }) => (
    <Container text>
      <Header
          as='h1'
          inverted
          style={ STYLE[screen].h1 }
      >
        <Image src={logo} />
        {' '}{content.title}
      </Header>
      <Header
          as='h2'
          inverted
          style={ STYLE[screen].h2 }
      >
        { content.description() }
      </Header>
      <Button primary size='huge' style={{ marginTop: '1em' }} href={ content.link }>
        Try it now
        <Icon name='right arrow' />
      </Button>

      <div style={{ marginTop: '2em' }}>
        <List horizontal>
          { badges.map((b, i) => <List.Item key={i}><Image {...b} /></List.Item>) }
        </List>
      </div>
    </Container>
);

Heading.propTypes = {
  screen: PropTypes.string,
};

export default Heading;
