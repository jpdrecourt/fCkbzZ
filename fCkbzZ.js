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
    this.dataSource = dataSource; // The dataSource is an object that returns an instance.
    this.post(dataSource.instance);
    setInterval(() => {this.post(dataSource.instance);}, frequency);
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
    this._instance = '';
  }
  set instance(val) {this._instance = val;}
  get instance() {return this._instance;}
}

class DateTweet extends DataSource {
  constructor() {
    super();
  }

  get instance() {
    return `Hello Twitter, it's now ${Date()} :o)`;
  }
}

class WikiPediaListicle extends DataSource {
  constructor() {
    super();
  }
  get instance() {
    let url = 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=revisions&rvprop=content&format=json';
    request(url,  (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    });
    return 'Just testing';
  }
}

let dataSource = new WikiPediaListicle();
let bot = new TwitterBot(dataSource, 10*1000);
