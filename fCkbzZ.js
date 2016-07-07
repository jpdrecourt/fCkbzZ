// Script for the twitter bot
console.log('Launching twitter bot!');

// Setup Twitter
let Twit = require('twit');
let config = require('./config.js');
let T = new Twit(config);

function tweeter() {
  let tweet = `Hello Twitter! It's ${Date()}`;
  T.post('statuses/update', {status:tweet }, tweet);
}

tweeter();
