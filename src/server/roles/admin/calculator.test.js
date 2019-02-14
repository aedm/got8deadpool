import {Calculator} from "/src/server/roles/admin/calculator.js";
import {assert} from 'meteor/practicalmeteor:chai';
import {
  OnePointCharacters,
  TwoPointCharacters,
  ThreePointCharacters,
  TwoPointEvents,
} from '/src/game/bets.js';

const BaseScore =
  1 * OnePointCharacters.length +
  2 * TwoPointCharacters.length +
  3 * ThreePointCharacters.length +
  2 * TwoPointEvents.length;

describe('calculating score', function() {

  it('counts scores', function() {
    let deadPool = {
      "js": {episode: 1}, // Jon Snow, 3 points
      "gw": {episode: 1}, // Grey Worm, 2 points
      "tm": {episode: 1}, // Thoros of Myr, 1 point
      "4": {episode: 1}, // Cleganebowl, 2 points
      "1": {comment: "ponies"},
    };
    let player1 = {votes: ["js", "gw", "tm", "4"]};
    let player2 = {votes: []};
    let player3 = {votes: ["js", "tm"]};
    let player4 = {votes: ["gw", "4"]};
    let player5 = {votes: ["js", "cl"]};
    let player6 = {votes: ["cl", "nk", "eg", "ag", "1", "2"]};

    let players = [player1, player2, player3, player4, player5, player6];
    Calculator.calculatePlayerScores(players, 1, deadPool);

    assert.deepEqual(player1.scores,
      [{score: BaseScore - 8, position: 4}, {score: BaseScore + 8, position: 0}]);
    assert.deepEqual(player2.scores,
      [{score: BaseScore, position: 0}, {score: BaseScore - 16, position: 4}]);
    assert.deepEqual(player3.scores,
      [{score: BaseScore - 4, position: 1}, {score: BaseScore - 4, position: 1}]);
    assert.deepEqual(player4.scores,
      [{score: BaseScore - 4, position: 1}, {score: BaseScore - 4, position: 1}]);
    assert.deepEqual(player5.scores,
      [{score: BaseScore - 6, position: 3}, {score: BaseScore - 10, position: 3}]);
    assert.deepEqual(player6.scores,
      [{score: BaseScore - 14, position: 5}, {score: BaseScore - 30, position: 5}]);
  });
});