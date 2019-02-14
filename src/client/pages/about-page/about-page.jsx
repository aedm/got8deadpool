import React from 'react';

export class AboutPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="container">
      <div className="game-page">
        <h2>Valar morghulis!</h2>
        <p>I created this game merely for fun. We played a similar game with some friends
          while watching season 6, and I was surprised how popular it got. So since I'm a web
          developer, I deciced to ditch the old spread&shy;sheets we used, and implement the game
          properly.</p>
        <p>I hope you enjoy it just as well as I enjoyed creating it. :)</p>
        <p>If you have any questions, please feel free to drop a mail to <i>korteur@gmail.com.</i>
        </p>
        <p>Cheers,<br/>Gábor</p>
      </div>
    </div>;
  }
}