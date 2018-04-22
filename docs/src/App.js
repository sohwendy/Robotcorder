import PropTypes from 'prop-types'
import React, { Component } from 'react';
import './App.css';
import Steps from './Steps';
import Footer from './Footer';
import Features from './Features';
import Info from './Info';
import Notice from './Notice';
import Heading from './Heading';
import Video from './Video';
import Code from './Code';
import { Button, Container, Icon, Menu, Responsive, Segment, Visibility } from 'semantic-ui-react';

const badges = [
  {
    src: "https://travis-ci.org/sohwendy/Robotcorder.svg?branch=master",
    href: "https://travis-ci.org/sohwendy/Robotcorder",
    alt: "Build Status",
  }, {
    src: "https://snyk.io/test/github/sohwendy/robotcorder/badge.svg?targetFile=package.json",
    href: "https://snyk.io/test/github/sohwendy/robotcorder/badge" ,
    alt: "Known Vulnerabilities",
  }, {
    src: "https://badges.greenkeeper.io/sohwendy/Robotcorder.svg",
    href: "https://greenkeeper.io/",
    alt: "Greenkeeper badge",
  },
];

const notice = '🍀 Robotcorder is now listed on RobotFramework.';
const video = { video: 'AnKconWzLAc' };

const heading = {
  title: 'Robotcorder',
  description: () => (
    <p>a chrome extension that generates test scripts for <a
      className='rclink'
      href='http://robotframework.org'
      style={{
        color: 'lightgray',
        textDecoration: 'underline lightgray'
      }}
    >RobotFramework</a></p>),
  link: 'https://chrome.google.com/webstore/detail/robotcorder/ifiilbfgcemdapeibjfohnfpfmfblmpd?hl=en'
};

const advantages = {
  title: 'Automating Test Automation',
  description: [
    'Improve software quality with test automation',
    "Catch bugs early, fix them early, save costs and increase customer satisfaction",
    "Let everyone in the team contribute to software quality with a lower barrier to scripting.",
    "Tighten feedback loop with reduced effort to write the test."
  ]
};

const content = {
  title: '4 steps to get your script',
  description:  [{
    id: "record",
    status: 'active',
    name: 'circle',
    title: 'Click on Record',
  }, {
    id: "keyboard",
    status: '',
    name: 'keyboard',
    title: 'Perform your test steps',
  }, {
    id: "stop",
    status: '',
    name: 'square',
    title: 'Stop Recording',
  }, {
    id: "download",
    status: 'active',
    name: 'download',
    title: 'Download the file',
  },
]};

const code = {
  title: "< Code />",
  description: [
    // eslint-disable-next-line
    "Open Browser  http://beanie.xxx/ ${browser}",
    'Click Link  link-home',
    'Input Text  device_name  Robotcorder',
    'Input Text  device_model  beta',
    'Select From List By Value  device_brand  Red',
    'Click Element  link-save'
  ]
};

const links = [
  {
    name: 'github',
    link: 'https://github.com/sohwendy/Robotcorder'
  }, {
    name: 'linkedin square',
    link: 'https://sg.linkedin.com/in/sohwendy'
  }, {
    name: 'medium',
    link: 'http://bit.ly/robotcorder-blog'
  }, {
    name: 'youtube',
    link: 'http://bit.ly/robotcorder-video'
  },
];


const featureIcons = [
  () => [
    <Icon name='settings' key='settings' size='big'/>,
    <Icon name='heartbeat' key='heartbeat' size='big'/>,
    <Icon name='student' key='student' size='big'/>,
    <Icon name='trophy' key='trophy' size='big'/>
  ],
  () => [
    <Icon key='user' name='user' size='big'/>,
    <Icon key='triangle right' name='triangle right' size='big'/>,
    <Icon key='users' name='users' size='big'/>,
    <Icon key='e1' name='' size='tiny'/>,
    <Icon key='add' name='add' size='small'/>,
    <Icon key='e2' name='' size='tiny'/>,
    <Icon key='bed' name='bed' size='big'/>
  ],
  () => [
    <Icon key='privacy' name='privacy' size='big'/>,
    <Icon key='lock' name='lock' size='big'/>,
    <Icon.Group key='spy' size='large'>
      <Icon name='dont' size='big'/>
      <Icon name='spy' />
    </Icon.Group>,
    <Icon.Group key='eye' size='large'>
      <Icon name='dont' size='big'/>
      <Icon name='eye' />
    </Icon.Group>
  ],
  () => [
    <Icon.Group key='money' size='large'>
      <Icon name='money' />
      <Icon name='dont' size='big'/>
    </Icon.Group>,
    <Button
        key='github'
        as='a'
        className='action1'
        compact
        color='grey'
        href='https://github.com/sohwendy/robotcorder'
        style={{marginLeft: '2em'}}
        aria-label='Star sohwendy/robotcorder on GitHub'
    >
      <Icon name='star' />
      Star
    </Button>,
    <Button
        key='chrome'
        as='a'
        color='green'
        compact
        className='action2'
        href='https://chrome.google.com/webstore/detail/robotcorder/ifiilbfgcemdapeibjfohnfpfmfblmpd/reviews?hl=en'
        style={{marginLeft: '1em'}}
        aria-label='Rate in chrome web store'
    >
      <Icon name='star' />
      Rate it
    </Button>
  ]

];


const features = {
  title: 'Features',
  description: [
    {
      header: 'Easy to use',
      description: 'Simple interface, configurable parameters, minimal learning required.',
      extra: featureIcons[0]
    }, {
      header: 'Increase efficiency',
      description: 'Reduce effort to hand-code the test. Skip the manual steps to extract the id, name etc.',
      extra: featureIcons[1]
    }, {
      header: 'Respect your privacy',
      description: 'No Ads. No logging. Standalone.',
      extra: featureIcons[2]
    }, {
      header: 'Open source',
      description: 'Free to use. Show your support.',
      extra: featureIcons[3]
    }
  ]
};

const footer = {
  copyright: '© 19 Apr 2018. Wendy 🤔',
  description: [
    'Thanks for supporting Robotcorder.',
    'Robotcorder has not been updated since I started working on the next major release.',
    'The play feature is particularly challenging.\n' +
    'The UI is almost ready, interaction with the browser is far from done.',
    '🎉 Shoutout to AmrithS for listing Robotcorder on RobotFramework site.'
  ]
};


const RobotLink = (props) => (
  <a
    href={props.link}
    style={{
      margin: '0 0.5em',
      backgroundColor: 'transparent',
      color: props.fixed ? '#37474f' : 'white'
    }}
  >
    <Icon name={props.name} size='large' />
  </a>
);

class DisplayContainer extends Component {
  state = { };

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children, screen } = this.props;
    const { fixed } = this.state;

    const width = screen === 'mobile' ? { minWidth: 320, maxWidth: 991 } : { minWidth: 992 };
    const style = screen === 'mobile' ? { minHeight: 350, padding: '1em 0em' } : { minHeight: 700, padding: '1em 0em' };

    return (
      <Responsive {...width}>
        <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
          <Segment inverted textAlign='center' style={style} vertical>

            <Menu
                fixed={fixed ? 'top' : null}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size='large'
            >
              <Container>
                {fixed ? <Menu.Item>Robotcorder</Menu.Item> : ''}
                <Menu.Item position='right'>
                  { links.map((link, i) => <RobotLink key={i} fixed={fixed} {...link} />)}
                </Menu.Item>
              </Container>
            </Menu>
            <Heading content={heading} badges={badges} screen={screen} />
          </Segment>
        </Visibility>
        { children }
      </Responsive>
    )
  }
}

DisplayContainer.propTypes = {
  children: PropTypes.node,
};

const section = (screen) => {
  return (
    <div>
      <Segment key='update' id='update' style={{background: '#FFF9C4', paddingTop: '3em', paddingBottom: '3em'}}>
        <Notice content={notice}/>
      </Segment>
      <Segment key='info' style={{
        padding: screen === 'desktop' ? '4em 0em' : '2em 1em'
      }} >
        <Info content={advantages} screen={screen} />
        <Features content={features} screen={screen} />
      </Segment>
      <Segment key='how_to_use' inverted style={{
        padding: screen === 'desktop' ? '6em 10em 7em' : '3em 1em'
      }} >
        <Steps content={content} screen={screen} />
        <Code content={code} screen={screen} />
      </Segment>
      <Segment key='video' style={{
        padding: screen === 'desktop' ? '4em 0em' : '3em 1.33em',
        margin: screen === 'desktop' ? '4em 0em' : '0',
      }}>
        <Video content={video} />
      </Segment>
      <Segment key='footer' inverted vertical style={{
        padding: screen === 'desktop' ? '1em 1em' : '1em 1em'
      }} >
        <Footer content={footer} screen={screen}/>
      </Segment>
    </div>
  )
};

const App = () => (
  <div>
    <DisplayContainer screen='desktop'>{section('desktop')}</DisplayContainer>
    <DisplayContainer screen='mobile'>{section('mobile')}</DisplayContainer>
  </div>
);

export default App;
