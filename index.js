'use strict';
const config = require('./config.json');
const request = require('request');
var IncomingWebhook = require('@slack/client').IncomingWebhook;
var webhook = new IncomingWebhook(config.slackWebHook);
var lastErrorMsg = '';
setInterval(function(){
    console.log('testing ' + config.url);
    request(config.url, function(err, res, body) {
      if (err || res.statusCode!==200) {
        var msg = '<!here> We have problem with connection to ' + config.url;
        if (lastErrorMsg !== msg) {
          lastErrorMsg = msg;
          webhook.send(msg, function(err, res) {
            if (err) {
                console.log('Error:', err);
            }
          });
        }
        return;
      }
      let data = JSON.parse(body);
      if(data.status === 'error') {

        if (lastErrorMsg !== data.error) {
          lastErrorMsg = data.error;
          webhook.send(data.error + ' on server: ' + config.url, function(err, res) {
            if (err) {
                console.log('Error:', err);
            }
          });
        }
      } else {
        if(lastErrorMsg !== '') {
          webhook.send('Thanks, everything is working ok now!', function(err, res) {
            if (err) {
                console.log('Error:', err);
            }
          });
        }
        lastErrorMsg = '';
      }
    });
}, parseInt(config.checkTime, 10)* 1000);
