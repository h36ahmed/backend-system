var _ = require('underscore');
var Mailgun = require('mailgun-js');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var Handlebars = require('handlebars');

//Your api key, from Mailgun’s Control Panel
var api_key = 'key-7c6af0a83116bdc97b7c498d9f4d33bb';

//Your domain, from the Mailgun Control Panel
var domain = 'www.lunchsociety.ca';

//Your sending email address
var from_who = 'daniel@lunchsociety.ca';

var mailgun = new Mailgun({
    apiKey: api_key,
    domain: domain
});

var templatesDir = path.resolve(__dirname, '..', 'email-templates');

var sendWelcomeEmail = function(data, res) {

    var welcomeEmail = new EmailTemplate(path.join(templatesDir, 'welcome-email'));

    Handlebars.registerPartial('name',
        '{{ name.first }} {{ name.last }}'
    );

    var locals = {
        email: data.email,
        name: {
            first: 'Hassan',
            last: 'Ahmed'
        }
    }

    welcomeEmail.render(locals, function(err, results) {
        if (err) {
            return console.error(err)
        }
        var data = {
            from: from_who,
            to: locals.email,
            subject: 'Hello from Lunch Society',
            html: results.html
        }

        mailgun.messages().send(data, function(err, body) {
            if (err) {
                res.status(500).send();
                console.log("got an error: ", err);
            } else {
                res.status(200).send();
                console.log(body);
            }
        });
    });
};

// POST /api/v1/sendEmail
exports.sendEmail = function(req, res) {
    var emailType = req.body.type;
    var email = req.body.email;

    switch (emailType) {
        case "welcome-email":
            sendWelcomeEmail({
                email: email
            }, res);
            break;
        default:
            return true;
    }
};

exports.sendWelcomeEmail = sendWelcomeEmail;


// GET /api/v1/validate
exports.validate = function(req, res) {
    var mailgun = new Mailgun({
        apiKey: api_key,
        domain: domain
    });

    var members = [{
        address: req.params.mail
    }];
    mailgun.lists('NAME@MAILINGLIST.COM').members().add({
        members: members,
        subscribed: true
    }, function(err, body) {
        console.log(body);
        if (err) {
            res.send("Error - check console");
        } else {
            res.send("Added to mailing list");
        }
    });
};
