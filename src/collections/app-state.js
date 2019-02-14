import { Mongo } from 'meteor/mongo';
import 'meteor/aldeed:collection2';

// This collection stores values that have only one instance.
export const AppState = new Mongo.Collection("appState");
