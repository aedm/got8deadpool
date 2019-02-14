import {Meteor} from 'meteor/meteor';
import fbgraph from 'fbgraph';

import {Logger} from "/src/lib/logger.js";
import {Players} from '/src/collections/players.js';
import {AppState} from '/src/collections/app-state.js';


// Exported for testing
export const onCreateUser = function(options, user) {
  let profile = {
    name: null,
    photo: null,
  };

  if (user.services.facebook) {
    // Use the user's Facebook name and photo
    profile.name = user.services.facebook.name;
    profile.photo = `https://graph.facebook.com/${user.services.facebook.id}/picture?type=square`;
  } else {
    profile.name = options.username;
  }

  let gameProgress = AppState.findOne("gameProgress");
  if (!!gameProgress && !gameProgress.isVotingClosed) {
    // Voting is not closed yet, create a player object
    Logger.log(`Creating a player object for ${profile.name}`);
    let player = {
      _id: user._id,
      profile,
      registrationTime: new Date(),
      votes: [],
      scores: [],
    };
    Players.insert(player, {filter: false});
  }

  // Store profile in user object, too
  profile.friendIds = [];
  user.profile = profile;

  return user;
};


// Exported for testing
export const onLogin = function(attempt) {
  Logger.debug("Login:", (attempt.user && attempt.user.profile) ? attempt.user.profile.name : "");
  let user = attempt.user;

  if (user.services.facebook) {
    let facebookId = user.services.facebook.id;

    let graphApi = fbgraph.setAccessToken(user.services.facebook.accessToken);

    graphApi.get(`${facebookId}/friends`, {limit: 5000},
      Meteor.bindEnvironment((err, result) => {
        if (err) {
          console.error(`Facebook access error for userid:${user.services.facebook.id}:\n${err}`);
          return;
        }

        // Facebook ids of friends
        let friendFacebookIds = result.data ? result.data.map(x => x.id) : [];

        // MongoDB ids of friends
        let friendIds = Meteor.users.find({
          "services.facebook.id": {$in: friendFacebookIds},
        }, {
          fields: {_id: 1},
        }).fetch().map(user => user._id);

        // Update user name and friends list
        Meteor.users.update(user._id, {
          $set: {"profile.friendIds": friendIds}
        }, {
          filter: false
        });

        // Also update friends of this user
        Meteor.users.update({
          _id: {$in: friendIds},
          "profile.friends": {$ne: user._id},
        }, {
          $addToSet: {"profile.friendIds": user._id},
        }, {
          filter: false
        });

        // Remove user from unfriended users' friend list
        Meteor.users.update({
          _id: {$nin: friendIds},
          "profile.friendIds": user._id,
        }, {
          $pull: {"profile.friendIds": user._id},
        }, {
          filter: false
        });
      }));

    // Update user name
    graphApi.get(facebookId,
        {fields: "name"},
        Meteor.bindEnvironment((err, result) => {
          if (err) {
            console.error(`Facebook access error for userid:${user.services.facebook.id}:\n${err}`);
            return;
          }

          let name = result.name;

          // Update user name and friends list
          Meteor.users.update(user._id, {
            $set: {"profile.name": name}
          }, {
            filter: false
          });

          Players.update(user._id, {
            $set: {"profile.name": name},
          }, {
            filter: false
          });
        }));
  }
};

Accounts.onCreateUser(onCreateUser);
Accounts.onLogin(onLogin);
