import {Meteor} from "meteor/meteor";
import {check} from 'meteor/check';

import {AppState} from '/src/collections/app-state.js';
import {Players} from '/src/collections/players.js';
import {Logger} from "/src/lib/logger.js";

export const userMethod = function(name, methodFunction) {
  let methodDef = {};
  methodDef[name] = function() {
    if (!Meteor.userId()) {
      throw new Meteor.Error("Needs to be logged in.");
    }
    Logger.log(`Method call: "${name}"`);
    return methodFunction.apply(this, arguments);
  };
  Meteor.methods(methodDef);
};


/**
 * Places a bet on a certain `betToken` character or event.
 *
 *   Meteor.call("player/bet", "cersei", true);
 *
 * @param {String} betToken
 * @param {Boolean} bet
 */
userMethod("player/bet", function(betToken, bet) {
  check(betToken, String);
  check(bet, Boolean);

  let gameProgress = AppState.findOne("gameProgress");
  if (!gameProgress || gameProgress.isVotingClosed) throw new Meteor.Error("Voting is closed");

  if (bet) {
    let affectedCount = Players.update(
      {
        _id: Meteor.userId(),
        votes: {$ne: betToken},
      },
      {$addToSet: {votes: betToken}},
      {filter: false});
    if (affectedCount) {
      AppState.update("voteCount", {$inc: {[betToken]: 1}});
    }
  } else {
    let affectedCount = Players.update(
      {
        _id: Meteor.userId(),
        votes: betToken,
      },
      {$pull: {votes: betToken}},
      {filter: false});
    if (affectedCount) {
      AppState.update("voteCount", {$inc: {[betToken]: -1}});
    }
  }
});

