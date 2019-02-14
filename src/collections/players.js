import {Mongo} from 'meteor/mongo';
import 'meteor/aldeed:collection2';


// Player data: votes, scores, basic profile
export const Players = new Mongo.Collection("players");

// Data schema for the "Players" collection.
// '_id' the same as 'user._id'.
Players.attachSchema(new SimpleSchema({
  "profile": {
    type: Object,
    label: "Profile",
  },

  // Facebook name of player
  "profile.name": {
    type: String,
    label: "Name",
  },

  // Facebook photo of player
  "profile.photo": {
    type: String,
    label: "Photo",
  },

  // Time of registration
  "registrationTime": {
    type: Date,
    label: "Time of registration",
  },

  // Votes
  "votes": {
    type: [String],
    optional: true,
    blackbox: true,
  },

  // Scores
  "scores": {
    type: [Object],
    optional: true,
  },

  // Score after nth episode
  "scores.$.score": {
    type: Number,
    optional: true,
  },

  // Position after nth episode
  "scores.$.position": {
    type: Number,
    optional: true,
  },
}));
