import React from 'react';
import {Button} from 'react-bootstrap';

export const WelcomeScreen = ({onClose, gameProgress}) => {
  let episodeMessage = (!gameProgress.isVotingClosed || gameProgress.episode === 0)
    ? "season 7" : `season 8 episode ${gameProgress.episode}`;
  return <div className="welcome-screen">
    <div className="container text-center">
      <h1>Game of Thrones<br/>
        Season 8 Dead Pool</h1>
      <p>This is a game. Predict the deaths of season 8 and compete against others.</p>
      <p>Spoilers everywhere.</p>

      <Button bsStyle="danger" onClick={() => onClose()}>
        I've seen {episodeMessage}, let me in
      </Button>
    </div>
  </div>;
}

