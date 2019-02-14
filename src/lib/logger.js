// Simple logging facility

export const Logger = {
  /**
   * Simple logger function. On server side it displays userId, too. In publications use
   * publishLog() instead.
   */
  log() {
    if (Meteor.isServer) {
      console.log.apply(
        null, [`[user:${Meteor.userId()}]`].concat(Array.prototype.slice.call(arguments)));
    } else {
      console.log.apply(null, arguments);
    }
  },

  /**
   * Simple error logger function. On server side it displays userId, too.
   */
  error() {
    if (Meteor.isServer) {
      console.error.apply(
        null, [`[user:${Meteor.userId()}]`].concat(Array.prototype.slice.call(arguments)));
    } else {
      console.error.apply(null, arguments);
    }
  },

  /**
   * Same as log(), but it only works in debug/test mode.
   */
  debug() {
    if (Meteor.settings.public.isDebug || Meteor.isTest) {
      if (Meteor.isServer && !Meteor.isTest) {
        console.log.apply(
          null, [`[user:${Meteor.userId()}]`].concat(Array.prototype.slice.call(arguments)));
      } else {
        console.log.apply(null, arguments);
      }
    }
  },

  /**
   * Same as error(), but it only works in debug/test mode.
   */
  debugError() {
    if (Meteor.settings.public.isDebug || Meteor.isTest) {
      if (Meteor.isServer && !Meteor.isTest) {
        console.error.apply(null, [`[user:${Meteor.userId()}]`].concat(arguments));
      } else {
        console.error.apply(null, arguments);
      }
    }
  },

  /**
   * Use this logger in Meteor publications. Pass "this" as first argument.
   */
  publishLog(thisRef) {
    console.log.apply(null,
      [`[user:${thisRef.userId}]`].concat(Array.prototype.slice.call(arguments, 1)));
  },

  /**
   * Use this error logger in Meteor publications. Pass "this" as first argument.
   */
  publishError(thisRef) {
    console.error.apply(null,
      [`[user:${thisRef.userId}]`].concat(Array.prototype.slice.call(arguments, 1)));
  },

};