# Game of Thrones season 7 dead pool
http://got.aedm.us

#### Running the webapp

The project uses Meteor. Just type
 
 `$ meteor`
  
in the project directory and the web server runs on `http://localhost:3000`.
 
#### Installing Facebook app id

While your app is running, enter the Mongo shell with `$ meteor mongo` (or any MongoDB client), and execute the following:

```
db.meteor_accounts_loginServiceConfiguration.update({
  "service": "facebook",
}, {
  $set: {
    "appId": "your_facebook_app_id",
    "secret": "your_facebook_app_secret",
  }
}, {upsert: true});
```

#### Giving admin rights to an existing user

The MongoDB script:

```
db.users.update(
  {"services.facebook.email": "yourmail@example.com"},
  {$set: {roles: ["admin"]}}
);
```
