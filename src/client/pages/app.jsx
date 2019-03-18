import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Button} from 'react-bootstrap';

import {WelcomeScreen} from '/src/client/pages/welcome-screen/welcome-screen.jsx';
import {Header} from '/src/client/components/header/header.jsx';
import {AppState} from '/src/collections/app-state.js';

class App_ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      welcomeScreen: true,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user && newProps.gameProgress &&
      (!newProps.gameProgress.isVotingClosed || newProps.gameProgress.episode === 0)) {
      this.setState({welcomeScreen: false});
    }
  }


  render() {
    if (this.props.isLoggingIn || !this.props.gameProgress) {
      return <div className="login">
        <Button disabled>Loading...</Button>
      </div>;
    }

    if (this.state.welcomeScreen) {
      return <WelcomeScreen onClose={() => this.setState({welcomeScreen: false}) }
                            gameProgress={this.props.gameProgress}/>;
    }

    return <div>
      <Header selectedHeaderPage={this.props.selectedHeaderPage}/>
      <div className="game-title">Season 8 Dead Pool</div>
      { this.props.content(this.props.subReady) }
    </div>;
  }
}

App_.propTypes = {
  content: React.PropTypes.func.isRequired,
};

export const App = createContainer(() => {
  let sub = Meteor.subscribe("player/sub/friends");

  return {
    subReady: sub.ready(),
    user: Meteor.user(),
    isLoggingIn: Meteor.loggingIn(),
    gameProgress: AppState.findOne("gameProgress"),
  };
}, App_);