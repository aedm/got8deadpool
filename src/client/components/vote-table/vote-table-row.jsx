import {Meteor} from 'meteor/meteor';
import React from 'react';

import {CountLabel} from '/src/client/components/vote-table/count-label.jsx';
import {FriendsList} from '/src/client/components/vote-table/friends-list.jsx';
import {ShowBet} from '/src/client/components/vote-table/show-bet.jsx';
import {Logger} from "/src/lib/logger.js";


export class VoteTableRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    let prevComment = this.props.status ? this.props.status.comment : null;
    let nextComment = nextProps.status ? nextProps.status.comment : null;
    let prevVote = this.props.player ? this.props.player.vote : null;
    let nextVote = nextProps.player ? nextProps.player.vote : null;
    let prevEpisode = this.props.status ? this.props.status.episode : null;
    let nextEpisode = nextProps.status ? nextProps.status.episode : null;

    return nextProps.voteCount !== this.props.voteCount ||
      nextProps.maxVoteCount !== this.props.maxVoteCount ||
      nextVote !== prevVote ||
      nextProps.votingPlayers.length !== this.props.votingPlayers.length ||
      !nextProps.votingPlayers.every((x, i) => x === this.props.votingPlayers[i]) ||
      prevComment !== nextComment ||
      prevEpisode !== nextEpisode ||
      this.props.isVotingClosed !== nextProps.isVotingClosed;
  }

  handleToggle(newVote) {
    setTimeout(() => Meteor.call("player/bet", this.props.bet.token, newVote), 0);
  }

  renderStatus() {
    if (!this.props.status || !this.props.status.comment) return null;
    return <div className="votetable-comment">
      {this.props.status.comment}
    </div>;
  }

  render() {
    return <div className="votetable-vote" key={this.props.token}>
      { !this.props.player ? null :
        <FriendsList player={this.props.player} votingPlayers={this.props.votingPlayers}
                     user={this.props.user}/> }
      <div className="votetable-row">
        <CountLabel voteCount={this.props.voteCount} maxVoteCount={this.props.maxVoteCount}/>
        <ShowBet handleToggle={this.handleToggle.bind(this)} bet={this.props.bet}
                 player={this.props.player} showAvatar={this.props.showAvatar}
                 showStatus={true} status={this.props.status}
                 isVotingClosed={this.props.isVotingClosed}/>
      </div>
      { this.renderStatus() }
    </div>;
  }
}


VoteTableRow.propTypes = {
  // The bet of this row
  bet: React.PropTypes.object,

  // Current player
  player: React.PropTypes.shape({
    vote: React.PropTypes.bool.isRequired,
  }),

  // Other players votes
  votingPlayers: React.PropTypes.arrayOf(React.PropTypes.object),

  // Sum of all counts for this bet
  voteCount: React.PropTypes.number,

  // The number of votes on the most popular bet
  maxVoteCount: React.PropTypes.number,

  // Should show avatar
  showAvatar: React.PropTypes.bool,

  // Status
  status: React.PropTypes.shape({
    episode: React.PropTypes.number,
    comment: React.PropTypes.string,
  }),

  // Is voting closed?
  isVotingClosed: React.PropTypes.bool,
};
