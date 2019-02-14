import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {stubs} from 'meteor/practicalmeteor:sinon';
import {resetDatabase} from 'meteor/xolvio:cleaner';

import '/src/server/roles/player/methods.js';
import {Players} from '/src/collections/players.js';
import {AppState} from '/src/collections/app-state.js';
import {initializeAppState} from "/src/server/collections/app-state.js";

describe('placing bets', function () {
  let fakeUser = {
    _id: "rdash",
    profile: {
      name: "Rainbow Dash",
      photo: "nope",
    },
  };

  beforeEach(function () {
    resetDatabase();
    initializeAppState();
    stubs.create('fakeUserId', Meteor, 'userId').returns(fakeUser._id);
    stubs.create('fakeUser', Meteor, 'user').returns(fakeUser);

    Players.insert({
      _id: fakeUser._id,
      profile: fakeUser.profile,
      registrationTime: new Date(),
      votes: [],
      scores: [],
    });

  });

  afterEach(function () {
    stubs.restoreAll();
  });

  it('registers a positive vote', function () {
    Meteor.call("player/bet", "cersei", true);

    let doc = Players.findOne(fakeUser._id);
    assert.sameMembers(doc.votes, ["cersei"]);
  });

  it('undoes a positive vote', function () {
    Meteor.call("player/bet", "cersei", true);
    Meteor.call("player/bet", "cersei", false);

    let doc = Players.findOne(fakeUser._id);
    assert.sameMembers(doc.votes, []);
  });

  it('registers a negative vote', function () {
    Meteor.call("player/bet", "cersei", false);

    let doc = Players.findOne(fakeUser._id);
    assert.sameMembers(doc.votes, []);
  });

  it('registers several votes', function () {
    Meteor.call("player/bet", "cersei", true);
    Meteor.call("player/bet", "jaime", true);
    Meteor.call("player/bet", "tyrion", true);
    Meteor.call("player/bet", "jaime", false);

    let doc = Players.findOne(fakeUser._id);
    assert.sameMembers(doc.votes, ["cersei", "tyrion"]);
  });

  it('can summarize votes', function () {
    for (let i=0; i<5; i++) {
      Meteor.call("player/bet", "cersei", true);
      Meteor.call("player/bet", "cersei", true);
      Meteor.call("player/bet", "cersei", false);
      Meteor.call("player/bet", "cersei", false);
      Meteor.call("player/bet", "cersei", false);
    }
    Meteor.call("player/bet", "cersei", true);

    let doc = Players.findOne(fakeUser._id);
    assert.sameMembers(doc.votes, ["cersei"]);
    let votecount = AppState.findOne("voteCount");
    assert.equal(votecount["cersei"], 1);
  });
});

