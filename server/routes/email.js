var _ = require('underscore');
var Mailgun = require('mailgun-js');

//Your api key, from Mailgun’s Control Panel
var api_key = 'key-7c6af0a83116bdc97b7c498d9f4d33bb';

//Your domain, from the Mailgun Control Panel
var domain = 'www.lunchsociety.ca';

//Your sending email address
var from_who = 'daniel@lunchsociety.ca';

// GET /api/v1/submit
exports.basic = function(req, res) {
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: req.body.mail,
    //Subject and text data
      subject: 'Hello from Mailgun',
      html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?">Click here to add your email address to a mailing list</a>'
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.status(500).send();
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.status(200).send();
            console.log(body);
        }
    });
};

// GET /api/v1/validate
exports.validate = function(req, res) {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var members = [
      {
        address: req.params.mail
      }
    ];
//For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
    mailgun.lists('NAME@MAILINGLIST.COM').members().add({ members: members, subscribed: true }, function (err, body) {
      console.log(body);
      if (err) {
            res.send("Error - check console");
      }
      else {
        res.send("Added to mailing list");
      }
    });

};

// GET /api/v1/invoice/:mail
exports.invoice = function(req, res) {
    //Which file to send? I made an empty invoice.txt file in the root directory
    //We required the path module here..to find the full path to attach the file!
    var path = require("path");
    var fp = path.join(__dirname, 'invoice.txt');
    //Settings
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: req.params.mail,
      subject: 'An invoice from your friendly hackers',
      text: 'A fake invoice should be attached, it is just an empty text file after all',
      attachment: fp
    };


    //Sending the email with attachment
    mailgun.messages().send(data, function (error, body) {
        if (error) {
            res.render('error', {error: error});
        }
            else {
            res.send("Attachment is on its way");
            console.log("attachment sent", fp);
            }
        });
};
