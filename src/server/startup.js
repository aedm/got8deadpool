import {initializeAppState} from "/src/server/collections/app-state.js";
import {Calculator} from "/src/server/roles/admin/calculator.js";

Meteor.startup(function() {
  // Create default AppState documents
  initializeAppState();

  // Recalculate votes
  Calculator.countVotes();
});
