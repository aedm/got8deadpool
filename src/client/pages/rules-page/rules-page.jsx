import React from 'react';

import {RuleTable} from '/src/client/components/vote-table/rule-table.jsx';


export class RulesPage extends React.Component {
  render() {
    return <div className="container">
      <div className="game-page">
        <h2>Rules</h2>
        <p>You'll be awarded some points for each prediction you make about the show. Scores
          get recalculated after every episode.</p>
        <div className="rules-ruletable">
          <RuleTable />
        </div>
        <p className="example">Example #1: you predict Benjen Stark to die, and he dies in episode
          4. After episode 4, you'll be awarded 2 points. But until then, you get no points for this
          prediction.</p>
        <p className="example">Example #2: you predict Missandei to survive, and she dies in episode
          6. After episode 6, you'll be awarded -1 point, but until then you'll have 1 point.</p>
        <p className="important">Each character has a value ranging from 1 to 3.</p>
        <p className="example">Example #3: You predict Grey Worm, who is a double score character,
          to die. If he dies, you get 4 points instead of 2. If he survives, you get zero.</p>
        <p className="example">Example #4: You predict Cersei, who is a triple score character, to
          survive. If she dies, you get -3 points instead of -1. If she survives, you get 3 points
          instead of 1.</p>
        <p className="important">The final result of the game will be determined on your final score
          after the last episode.</p>
      </div>
    </div>;
  }
}