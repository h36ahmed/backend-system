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

    var welcomeEmail = new EmailTemplate(path.join(templatesDir, 'welcome'));

    Handlebars.registerPartial('name',
        '{{ name.first }} {{ name.last }}'
    );

    var locals = {
        email: data.email,
        name: {
            first: 'Customer',
            last: ''
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

var sendOrderEmail = function(data, res) {

    var orderEmail = new EmailTemplate(path.join(templatesDir, 'order'));

    // Magic Needs to Happen Here.

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

    orderEmail.render(locals, function(err, results) {
        if (err) {
            return console.error(err)
        }
        var data = {
            from: from_who,
            to: locals.email,
            subject: 'Order Information',
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

// Cancel Order Email
var sendCOEmail = function(data, res) {

    var coEmail = new EmailTemplate(path.join(templatesDir, 'cancel-order'));

    // Magic Needs to Happen Here.

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

    coEmail.render(locals, function(err, results) {
        if (err) {
            return console.error(err)
        }
        var data = {
            from: from_who,
            to: locals.email,
            subject: 'CANCELLED: Order Status Update',
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

var sendFeedbackEmail = function(data, res) {

    var feedbackEmail = new EmailTemplate(path.join(templatesDir, 'feedback'));

    // Magic Needs to Happen Here.

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

    feedbackEmail.render(locals, function(err, results) {
        if (err) {
            return console.error(err)
        }
        var data = {
            from: from_who,
            to: locals.email,
            subject: 'Thank You For Providing Feedback!',
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

var sendExitEmail = function(data, res) {

    var exitEmail = new EmailTemplate(path.join(templatesDir, 'exit'));

    // Magic Needs to Happen Here.

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

    exitEmail.render(locals, function(err, results) {
        if (err) {
            return console.error(err)
        }
        var data = {
            from: from_who,
            to: locals.email,
            subject: 'Sad To See You Leaving!',
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
        case "welcome-email":
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
        case "feedback-email":
            sendFeedbackEmail({
                email: email
            }, res);
            break;
        case "exit-email":
            sendExitEmail({
                email: email
            }, res);
            break;
        default:
            return true;
    }
};

exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendOrderEmail = sendOrderEmail;
exports.sendCOEmail = sendCOEmail;
exports.sendFeedbackEmail = sendFeedbackEmail;
exports.sendExitEmail = sendExitEmail;

/*
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
*/
