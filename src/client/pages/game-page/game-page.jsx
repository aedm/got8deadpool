import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Button} from 'react-bootstrap';

import {VoteTable} from '/src/client/components/vote-table/vote-table.jsx';
import {Helpers} from '/src/client/helpers.js';
import {RuleTable} from '/src/client/components/vote-table/rule-table.jsx';
import {AppState} from '/src/collections/app-state.js';
import {Players} from '/src/collections/players.js';

export class _GamePage extends React.Component {
  renderLoginButton() {
    if (this.props.isLoggingIn) {
      return <Button disabled>
        Logging in...
      </Button>;
    }
    else if (!this.props.user) {
      return <div className="login-button text-center">
        <Button bsStyle="primary" onClick={() => Helpers.facebookLogin()}>
          Log in with Facebook
        </Button>
      </div>;
    }
  }

  renderGameState() {
    let resultsURL = FlowRouter.path("results");
    if (this.props.gameProgress.isSeasonOver) {
      return <div className="gameinfo-box">
        <h2>Game over</h2>
        <p>All episodes of season 8 have been aired.
          {!!this.props.player ?
            <span> See your final scores on the <a href={resultsURL}>results page</a>.</span> : ""}
        </p>
      </div>;
    }

    if (!this.props.gameProgress.isVotingClosed || !this.props.user) {
      return <div className="gameinfo-box">
        <h2>What's this game about?</h2>
        <p>Predict who dies in season 8 of Game of Thrones
          and compete against others.</p>
        <p>Voting was closed right before the season started. Scores get updated after each
          episode. Your predictions are public.</p>
        <p>It's for free and you can't win anything.</p>
        <p>This is a fan-made website, I have no affiliation with HBO, everything here is the
          property of their respective owners.</p>
      </div>;
    }

    let episodeMessage = (this.props.gameProgress.episode === 0)
      ? "before season 8" : `after episode ${this.props.gameProgress.episode}`;

    return <div className="gameinfo-box">
      <h2>The game is on</h2>
      {!!this.props.player ? <p>Voting is closed.</p> :
        <p>Unfortunately, you can't vote since you registered after voting was closed.
          But you can see your Facebook friends' scores in the results section,
          and I'll send you an invite for season 8 in time.</p>}
      <p>Last updated: {episodeMessage}.</p>
    </div>;
  }

  renderRules() {
    return <div className="container">
      <div className="gameinfo">
        {this.renderGameState()}
        <div className="gameinfo-box">
          <h2>Scoring</h2>
          <p>You'll get points for your predictions, according to the chart below.
            See some <a href="/rules">examples</a>.</p>
          <RuleTable/>
        </div>
      </div>
    </div>;
  }

  render() {
    return <div>
      {this.renderRules()}
      <div className="login">
        {this.renderLoginButton()}
      </div>
      <VoteTable friendSubReady={this.props.friendSubReady}/>
    </div>;
  }
}

_GamePage.propTypes = {
  user: React.PropTypes.object,
  friendSubReady: React.PropTypes.bool.isRequired,
};

export const GamePage = createContainer(() => {
  return {
    user: Meteor.user(),
    isLoggingIn: Meteor.loggingIn(),
    gameProgress: AppState.findOne("gameProgress"),
    player: Players.findOne(Meteor.userId()),
  };
}, _GamePage);
