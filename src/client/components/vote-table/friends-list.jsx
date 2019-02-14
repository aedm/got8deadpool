import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';


export class FriendsList extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.player.vote !== this.props.player.vote
        || nextProps.votingPlayers.length != this.props.votingPlayers.length
        || !nextProps.votingPlayers.every((x, i) => x === this.props.votingPlayers[i]);
  }

  render() {
    let vote = this.props.player.vote;

    return <div className="votetable-friends-list">
      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">You</Tooltip>}>
        <img className={`votetable-avatar votetable-avatar-self ${vote ? "votetable-voted" : ""}`}
             style={{zIndex: this.props.votingPlayers.length + 1}}
             src={this.props.user.profile.photo || "/asset/avatar50px.jpg"}/>
      </OverlayTrigger>
      { this.props.votingPlayers.map((player, index) =>
          <OverlayTrigger key={index} placement="top"
                          overlay={<Tooltip id="tooltip">{player.profile.name}</Tooltip>}>
            <img className="votetable-avatar"
                 style={{zIndex: `${this.props.votingPlayers.length - index}`}}
                 src={player.profile.photo || "/asset/avatar50px.jpg"}/>
          </OverlayTrigger>)}
    </div>;
  }
}


FriendsList.propTypes = {
  // Current player
  player: React.PropTypes.shape({
    vote: React.PropTypes.bool.isRequired,
  }),

  // Other players votes
  votingPlayers: React.PropTypes.arrayOf(React.PropTypes.object),
};
