import React from 'react';


export class CountLabel extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.voteCount != this.props.voteCount ||
        nextProps.maxVoteCount != this.props.maxVoteCount;
  }

  // Generates background color for the "sum" cell
  getBackgroundColor() {
    let ratio = this.props.voteCount / this.props.maxVoteCount;
    // 120 is green, 0 is red
    let hue = 120 * (1 - ratio);
    let saturation = 0 + 100 * ratio;
    let lightness = 30 + 30 * ratio;
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  }

  render() {
    let background = this.getBackgroundColor();
    return <div className="votetable-count">
      <div className="votetable-count-label" style={{"backgroundColor": background}}>
        {this.props.voteCount}
      </div>
    </div>;
  }
}

CountLabel.propTypes = {
  // Sum of all counts for this bet
  voteCount: React.PropTypes.number,

  // The number of votes on the most popular bet
  maxVoteCount: React.PropTypes.number,
};
