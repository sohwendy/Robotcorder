import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import icon from './assets/logo-128-red.svg';

const Footer = ({ content, screen }) => (
  <Container>
    <Grid divided inverted stackable>
      <Grid.Row>
        {
          screen === 'desktop' ?
            <Grid.Column width={4}>
               <Image src={icon} centered size='small' />
            </Grid.Column>
            : ''
        }
        <Grid.Column width={12}>
          { content.description.map((d,i) => <p key={i}>{d}</p>) }
          <p>{content.copyright}</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Footer;
