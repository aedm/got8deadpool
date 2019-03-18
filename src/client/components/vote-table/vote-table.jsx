import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Button} from 'react-bootstrap';

import {Players} from '/src/collections/players.js';
import {
  OnePointCharacters,
  TwoPointCharacters,
  ThreePointCharacters,
  TwoPointEvents,
  Bets
} from '/src/game/bets.js';
import {AppState} from '/src/collections/app-state.js';
import {VoteTableRow} from '/src/client/components/vote-table/vote-table-row.jsx';

class _VoteTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.processProps(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.processProps(newProps));
  }

  processProps(props) {
    let rows = {};
    let hasPlayer = !!props.currentPlayer;

    let maxVoteCount = 1;
    if (props.voteCounts) {
      _.each(props.voteCounts, count => {
        if (count > maxVoteCount) maxVoteCount = count;
      });
    }

    // Create rows with empty data, false everywhere
    _.each(Bets, bet => {
      rows[bet.token] = {
        bet,
        player: hasPlayer ? {vote: false} : null,
        votingPlayers: [],
        voteCount: props.voteCounts ? props.voteCounts[bet.token] : -1,
        maxVoteCount,
      };
    });

    // Fill rows with players votes
    if (hasPlayer) {
      props.currentPlayer.votes.forEach(token => {
        let row = rows[token];
        if (row) {
          row.player.vote = true;
        }
      });
    }

    // Fill in rows with other players votes
    if (props.players) {
      props.players.forEach((player) => {
        player.votes.forEach(token => {
          let row = rows[token];
          if (row) row.votingPlayers.push(player);
        });
      });
    }

    return {rows};
  }

  renderBetArray(array, showAvatar) {
    return <div className="votetable">
      {array.map(bet => {
        let token = bet.token;
        let status = this.props.gameProgress.deadPool[token];
        return <VoteTableRow key={token} showAvatar={showAvatar} status={status}
                             user={this.props.user} {...this.state.rows[token]}
                             isVotingClosed={this.props.gameProgress.isVotingClosed}/>;
      })}
    </div>;
  }

  renderReadOnlyTable() {
    return <div className="container">
      <div className="row">
        <div className="character-column">
          <h2>Triple score characters</h2>
          {this.renderBetArray(ThreePointCharacters, true)}
        </div>
        <div className="character-column">
          <h2>Double score characters</h2>
          {this.renderBetArray(TwoPointCharacters, true)}
        </div>
        <div className="character-column">
          <h2>Other<br/>characters</h2>
          {this.renderBetArray(OnePointCharacters, true)}
        </div>
      </div>
      <div className="row">
        <h2 className="table-header">Double score events</h2>
        {this.renderBetArray(TwoPointEvents)}
      </div>
    </div>;
  }

  renderPlayerTable() {
    return <div className="table-container">
      <h2>Triple score characters</h2>
      {this.renderBetArray(ThreePointCharacters, true)}
      <h2 className="table-header">Double score characters</h2>
      {this.renderBetArray(TwoPointCharacters, true)}
      <h2 className="table-header">Other characters</h2>
      {this.renderBetArray(OnePointCharacters, true)}
      <h2 className="table-header">Double score events</h2>
      {this.renderBetArray(TwoPointEvents)}
      {this.props.gameProgress.isVotingClosed ? null :
        <div className="text-center"><p>Your choices were automatically saved. You can change them
          anytime before the season starts.</p>
        </div>}
    </div>;
  }

  renderFooter() {
    return <div className="text-center">It's better to play with friends!&nbsp;
      <a href="http://www.facebook.com/sharer/sharer.php?u=got.aedm.io">Share on Facebook</a>.
      <br/><br/><br/><br/>
    </div>;
  }

  render() {
    if (this.props.isLoggingIn) return null;

    if (!this.props.friendSubReady || !this.props.gameProgress) {
      return <div className="login">
        <Button disabled>Loading...</Button>
      </div>;
    }

    return <div>
      {this.props.currentPlayer ? this.renderPlayerTable() : this.renderReadOnlyTable()}
      {this.renderFooter()}
    </div>;
  }
}

_VoteTable.propTypes = {
  userId: React.PropTypes.string,
  players: React.PropTypes.array,
  currentPlayer: React.PropTypes.object,
  gameProgress: React.PropTypes.object,
  voteCounts: React.PropTypes.object,
  friendSubReady: React.PropTypes.bool.isRequired,
};

export const VoteTable = createContainer(() => {
  let userId = Meteor.userId();
  let playerSelector = userId ? {_id: {$ne: userId}} : {};
  let voteCounts = AppState.findOne("voteCount");

  return {
    user: Meteor.user(),
    isLoggingIn: Meteor.loggingIn(),
    players: Players.find(playerSelector, {sort: {registrationTime: -1}}).fetch(),
    currentPlayer: userId ? Players.findOne(userId) : null,
    gameProgress: AppState.findOne("gameProgress"),
    voteCounts,
  };
}, _VoteTable);
