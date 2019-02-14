import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {stubs} from 'meteor/practicalmeteor:sinon';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import fbgraph from 'fbgraph';

import '/src/server/roles/player/methods.js';
import {Players} from '/src/collections/players.js';
import {onCreateUser, onLogin} from '/src/server/roles/player/registration-hook.js';
import {initializeAppState} from "/src/server/collections/app-state.js";


describe('facebook integration', function () {
  let createUser = function (id, name, fbid) {
    return {
      _id: id,
      profile: {
        name,
        photo: "photo",
      },
      services: {
        facebook: {
          name,
          id: fbid,
          accessToken: "access" + fbid,
        }
      },
    }
  };

  let users = [
    createUser("rdash", "Rainbow Dash", "fb0"),
    createUser("fshy", "Fluttershy", "fb1"),
    createUser("ajack", "Applejack", "fb2"),
  ];

  let callOnLogin = function (index, friends) {
    let user = users[index];
    stubs.create('fakeFacebookToken', fbgraph, "setAccessToken").returns(fbgraph);
    stubs.create('fakeFacebookProfile', fbgraph, "get", function (fbid, fields, callback) {
      let result = null;
      if (fields.fields === "name") {
        result = {
          name: user.profile.name,
        };
      } else if (fbid.endsWith("friends")) {
        result = {
          data: friends.map(id => {
            return {id};
          }),
        };
      }
      callback(null, result);
    });
    onLogin({user});
  };

  let callOnCreateUser = function (index) {
    let user = users[index];
    stubs.create('fakeUserId', Meteor, 'userId').returns(user._id);
    stubs.create('fakeUser', Meteor, 'user').returns(user);
    onCreateUser(null, user);
    Meteor.users.insert(user);
    callOnLogin(index, []);
  };

  beforeEach(function () {
    resetDatabase();
    initializeAppState();
  });

  afterEach(function () {
    stubs.restoreAll();
  });

  it('registers a new user', function () {
    callOnCreateUser(0);
    assert.equal(Players.findOne(users[0]._id).profile.name, "Rainbow Dash");
    assert.equal(Meteor.users.findOne(users[0]._id).profile.name, "Rainbow Dash");
  });

  it('registers several new users', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnCreateUser(2);
    assert.equal(Players.findOne(users[0]._id).profile.name, "Rainbow Dash");
    assert.equal(Meteor.users.findOne(users[0]._id).profile.name, "Rainbow Dash");
    assert.equal(Players.findOne(users[1]._id).profile.name, "Fluttershy");
    assert.equal(Meteor.users.findOne(users[1]._id).profile.name, "Fluttershy");
    assert.equal(Players.findOne(users[2]._id).profile.name, "Applejack");
    assert.equal(Meteor.users.findOne(users[2]._id).profile.name, "Applejack");
  });

  it('is aware of friends #1', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
  });

  it('is aware of friends #2', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnCreateUser(2);
    callOnLogin(0, ["fb1"]);
    callOnLogin(2, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash", "ajack"]);
    assert.sameMembers(Meteor.users.findOne(users[2]._id).profile.friendIds, ["fshy"]);
  });

  it('is aware of unfriending #1', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(0, []);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, []);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, []);
  });

  it('is aware of unfriending #2', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(1, []);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, []);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, []);
  });

  it('is aware of unfriending #3', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnCreateUser(2);
    callOnLogin(0, ["fb1"]);
    callOnLogin(2, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash", "ajack"]);
    assert.sameMembers(Meteor.users.findOne(users[2]._id).profile.friendIds, ["fshy"]);
    callOnLogin(1, ["fb0"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    assert.sameMembers(Meteor.users.findOne(users[2]._id).profile.friendIds, []);
  });

  it("keeps unchanged friendships", function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(1, ["fb0"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
  });

  it('is aware of refriending', function () {
    callOnCreateUser(0);
    callOnCreateUser(1);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(1, []);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, []);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, []);
    callOnLogin(1, ["fb0"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
    callOnLogin(0, []);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, []);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, []);
    callOnLogin(0, ["fb1"]);
    assert.sameMembers(Meteor.users.findOne(users[0]._id).profile.friendIds, ["fshy"]);
    assert.sameMembers(Meteor.users.findOne(users[1]._id).profile.friendIds, ["rdash"]);
  });
});


