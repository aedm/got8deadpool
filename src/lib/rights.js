import {Roles} from 'meteor/alanning:roles';

export const Rights = {
  isAdmin(userId) {
    return Roles.userIsInRole(userId, "admin");
  },
};


