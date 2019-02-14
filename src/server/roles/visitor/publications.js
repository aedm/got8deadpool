import {Meteor} from 'meteor/meteor';

import {AppState} from '/src/collections/app-state.js';


// Always publish the entire configuration object to all visitors
Meteor.publish(null, function () {
  return AppState.find();
});
