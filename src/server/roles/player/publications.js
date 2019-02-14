import {Meteor} from 'meteor/meteor';

import {Players} from '/src/collections/players.js';
import {Logger} from "/src/lib/logger.js";

const userPublish = function(name, methodFunction) {
  Meteor.publish(name, function() {
    if (!this.userId) {
      // No logged in, return empty collection.
      return null;
    }
    Logger.publishLog(this, `Subscription: "${name}"`);
    return methodFunction.apply(this, arguments);
  });
};

const userPublishComposite = function(name, methodFunction) {
  Meteor.publishComposite(name, function(params) {
    Logger.publishLog(this, `Subscription: "${name}"`);
    return {
      find() {
        return Meteor.users.find(this.userId,
          {
            limit: 1,
            fields: {},
          });
      },
      children: [methodFunction(params)],
    }
  });
};


// Publishes the player's friends
userPublishComposite("player/sub/friends", function() {
  return {
    find: function(user) {
      // Returns the player objects of the player and her friends
      let ids = user.profile.friendIds.concat(user._id);
      return Players.find({_id: {$in: ids}});
    }
  };
});


