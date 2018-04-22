import React from 'react';
import { Embed, Container, Header } from 'semantic-ui-react';
import banner from './assets/promo-m.png';

const Video = ({content}) => (
  <Container text>
    <Header textAlign='center' as='h3'>Watch it in action</Header>
    <Embed
        id={content.video}
        placeholder={banner}
        source='youtube'
    />
  </Container>
);

export default Video;
