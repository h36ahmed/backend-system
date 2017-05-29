var _ = require('underscore');
var postmark = require("postmark");
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var fs = require('fs');
var Handlebars = require('handlebars');

//Your api key
var api_key = '32b29fd6-338e-49a4-98be-25a4c21458d3';

//Your domain
var domain = 'www.lunchsociety.ca';

//Your sending email address
var from_who = 'Lunch Society <admin@lunchsociety.ca>';

var client = new postmark.Client(api_key);

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
            From: locals.from,
            To: locals.email,
            Subject: locals.subject,
            HtmlBody: results.html,
            TextBody: results.text,
        };

        client.sendEmail(data, function(err, response) {
            if (err) {
                console.error(err.status)
                console.error(err.message)
                return
            }
            console.log(response);
            cb();
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
        data: data,
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
    console.log(data)
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

var sendInvoiceEmail = function(data, res) {

    var locals = {
        email: data.email,
        from: from_who,
        data: {
            name: 'Hassan Ahmed'
        },
        template: 'invoice',
        subject: 'Invoice For Lunch Society'
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

    models.restaurants.findAll({
        attributes: ['id', 'name'],
        include: [{
            attributes: ['name', 'id'],
            model: models.meals,
            include: [{
                attributes: ['id'],
                model: models.offers,
                include: [{
                    model: models.orders,
                    where: where,
                    order: [
                        ['pickup_time']
                    ],
                    include: [{
                        model: models.customers,
                        attributes: ['first_name', 'last_name']
                    }, {
                        model: models.pickup_times,
                        attributes: ['pickup_time']
                    }]
                }]
            }]
        }, {
            attributes: ['first_name', 'last_name', 'phone_number'],
            model: models.owners,
            include: [{
                model: models.users,
                attributes: ['email']
            }]
        }]
    }).then(function(restaurants) {
        Promise.all(_.map(restaurants, function(restaurant) {
                return template.render(restaurant)
                    .then(function(results) {
                        const todayDate = formatDate(new Date());
                        return {
                            From: from_who,
                            To: restaurant.owner.user.email,
                            Subject: 'LUNCH SOCIETY: Orders for: ' + todayDate,
                            HtmlBody: results.html,
                            TextBody: results.text
                        }
                    })
            }))
            .then(function(messages) {
                client.sendEmailBatch(messages, function(err, batchResults) {
                    // Throwing inside a promise will just reject the promise
                    // not stop your server
                    if (err) throw err
                    console.info('Messages sent to postmark');
                });
            });
    }, function(e) {
        res.status(500).json(e);
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
        case "invoice":
            sendInvoiceEmail({
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
exports.sendInvoiceEmail = sendInvoiceEmail;
