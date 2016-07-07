// Script for the twitter bot
console.log('Launching twitter bot!');

// Setup Twitter
let Twit = require('twit');
let config;

// Dirty way of handling config files locally and remotely
try {
  // Location of config file on OpenShift
  config = require('../data/config.js');
} catch(err) {
  // Local file not committed - Check config-empty.js for template
  config = require('./config.js');
}

let T = new Twit(config);

function tweeter() {
  let tweet = `Hello Twitter! It's ${Date()}. All good here.`;
  T.post('statuses/update', {status:tweet }, tweet);
}

tweeter();
