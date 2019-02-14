import {Bets, OnePointCharacters, TwoPointCharacters, ThreePointCharacters, TwoPointEvents} from '/src/game/bets.js';
import {assert} from 'meteor/practicalmeteor:chai';

describe('characters and events', function () {
  it('bet tokens should be unique', function () {
    let betCount = OnePointCharacters.length +
        TwoPointCharacters.length +
        ThreePointCharacters.length +
        TwoPointEvents.length;
    assert.equal(betCount, _.keys(Bets).length);
  });
});

