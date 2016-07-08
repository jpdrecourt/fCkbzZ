// Script for the twitter bot
console.log('Launching twitter bot!');

//
const request = require('request');

// Setup Twitter
const Twit = require('twit');
let config;
// Dirty way of handling config files locally and remotely
try {
  // Location of config file on OpenShift
  config = require('../data/config.js');
} catch(err) {
  // Local file not committed - Check config-empty.js for template
  config = require('./config.js');
}

class TwitterBot {
  constructor(dataSource, frequency = 60*60*1000) {
    this._T = new Twit(config);
    this.frequency = frequency;
    dataSource.getInstance(this.post);
    this.dataSource = dataSource; // The dataSource is an object that produces instances and takes this.post as a callback function.
    setInterval(() => {dataSource.getInstance(this.post);}, frequency);
  }
  post(tweet) {
    if (tweet !=='') {
      console.log(tweet);
//    this._T.post('statuses/update', {status:tweet}, tweet);
    } else {
      throw new Error('dataSource returning empty tweet, exiting.');
    }
  }
}

class DataSource {
  constructor() {
    this.instance = '';
  }
}

class DateTweet extends DataSource {
  constructor() {
    super();
  }
  // Gets instance and passes it to the callback function
  getInstance(callback) {
    setTimeout(() => {
      this.instance = `Hello Twitter, it's ${Date()} and I'm posting this asynchronously.`;
      callback(this.instance);
    }, 5000*Math.random());
  }
}

class WikiPediaListicle extends DataSource {
  constructor() {
    super();
  }
  getInstance(callback) {
    let url = 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=revisions&rvprop=content&format=json';
    request(url,  (error, response, body) => {
      if (!error && response.statusCode == 200) {
        callback(body);
        return true;
      } else {
        console.log('Problems fetching data. Returning empty string.');
        callback('');
        return false;
      }
    });
  }
}

let dataSource = new WikiPediaListicle();
let bot = new TwitterBot(dataSource, 10*1000);
