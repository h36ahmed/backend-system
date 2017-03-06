var _ = require('underscore');
var Mailgun = require('mailgun-js');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var fs = require('fs');
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

var templates = {};

var response;

// load templates once
fs.readdirSync(templatesDir).forEach(function(file) {
    if (fs.statSync(path.join(templatesDir, file)).isDirectory()) {
        templates[file] = new EmailTemplate(path.join(templatesDir, file));
    }
});

function send(locals, cb) {
    var data = {};
    var template = templates[locals.template];

    if (!template) {
        return cb({
            msg: 'Template not found',
            status: 500
        });
    }

    template.render(locals, function(err, results) {
        if (err) {
            return cb(err);
        }

        data = {
            from: locals.from,
            to: locals.email,
            subject: locals.subject,
            html: results.html,
            text: results.text
        };

        mailgun.messages().send(data, function(err, body) {
            if (err) {
                return cb(err);
            }
            cb(null);
        });
    });
}

function complete(err) {
    if (err) {
        response.status(err.status).send();
        console.log("got an error: ", err.msg);
    } else {
        response.status(200).send();
    }
}

var sendWelcomeEmail = function(data, res) {

    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'welcome',
        subject: 'Hello from Lunch Society'
    }

    response = res;

    send(locals, complete);
};

var sendOrderEmail = function(data, res) {

    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'order',
        subject: 'Order Information'
    }

    response = res;

    send(locals, complete);
};

// Cancel Order Email
var sendCOEmail = function(data, res) {


    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'cancel-order',
        subject: 'CANCELLED: Order Status Update'
    }

    response = res;

    send(locals, complete);

};

var sendFeedbackEmail = function(data, res) {

    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'feedback',
        subject: 'Thank You For Providing Feedback!'
    }

    response = res;

    send(locals, complete);

};

var sendExitEmail = function(data, res) {

    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'exit',
        subject: 'Sad To See You Leaving!'
    }

    response = res;

    send(locals, complete);
};

function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + "-" + mm + "-" + dd;
}

// POST /api/v1/sendROEmail
exports.sendROEmail = function(req, res) {

    var roEmail = new EmailTemplate(path.join(templatesDir, 'restaurant-orders'));

    // Magic Needs to Happen Here.

    Promise.all(_.map(restaurants, function(restaurant) {
            return template.render(restaurant)
                .then(function(results) {
                    const todayDate = formatDate(new Date());
                    return {
                        from: from_who,
                        to: restaurant.email,
                        subject: 'Orders for: ' + todayDate,
                        html: results.html
                    }
                })
        }))
        .then(function(messages) {
            /*mailgun.messages().send(data, function(err, body) {
                if (err) {
                    res.status(500).send();
                    console.log("got an error: ", err);
                } else {
                    res.status(200).send();
                    console.log(body);
                }
            });*/
        });
};

// POST /api/v1/sendEmail
exports.sendEmail = function(req, res) {
    var emailType = req.body.type;
    var email = req.body.email;

    switch (emailType) {
        case "welcome":
            sendWelcomeEmail({
                email: email
            }, res);
            break;
        case "order":
            sendOrderEmail({
                email: email
            }, res);
            break;
        case "cancel-order":
            sendCOEmail({
                email: email
            }, res);
            break;
        case "feedback":
            sendFeedbackEmail({
                email: email
            }, res);
            break;
        case "exit":
            sendExitEmail({
                email: email
            }, res);
            break;
        default:
            res.status(204).send();
    }
};

exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendOrderEmail = sendOrderEmail;
exports.sendCOEmail = sendCOEmail;
exports.sendFeedbackEmail = sendFeedbackEmail;
exports.sendExitEmail = sendExitEmail;
