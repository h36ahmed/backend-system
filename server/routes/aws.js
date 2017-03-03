var _ = require('underscore');
var models = require('../db.js');

var aws = {
    bucket: 'ls-frontend',
    region: 'ca-central-1',
    secret: 'AKIAIIFU7XS25I6B7FMA',
    key: 'i+sAULkpYNsysKv/Z7+Kx5lPr2OAhRmxIGywKiru'
}
var crypto = require('crypto');
var moment = require('moment');
var shortid = require('shortid');

var s3Url = 'https://' + aws.bucket + '.s3-' + aws.region + '.amazonaws.com';

exports.signing = function(req, res) {
    var request = req.body;

    var fileName = shortid.generate();

    var path = "";

    switch (request.page) {
        case "meals":
            path = "meals/" + fileName;
            break;
        case "restaurants":
            path = "restaurants/" + fileName;
            break;
        case "users":
            path = "users/" + fileName;
            break;
        default:
            path = "misc/" + fileName;
    }

    var readType = 'public-read';

    const date = new Date().toISOString().replace(/[\.\-:]/gi, "").substr(0, 15) + "Z";
    const dateNowRaw = date.substr(0, date.indexOf("T"));

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    const expiration = expirationDate.toISOString();

    const credentials = '779056531898/' + dateNowRaw + '/ca-central-1/s3/aws4_request';

    const policy = {
        expiration: expiration,
        conditions: [{
                "bucket": aws.bucket
            }, {
                "acl": "private"
            },
            ["starts-with", "$key", path],
            ['starts-with', '$Content-Type', request.type], {
                "x-amz-credential": credentials
            }, {
                "x-amz-algorithm": "AWS4-HMAC-SHA256"
            }, {
                "x-amz-date": date
            }
        ]
    };

    const base64Policy = new Buffer(JSON.stringify(policy), "utf-8").toString("base64");

    const dateKey = crypto.createHmac('sha256', "AWS4" + aws.key).update(dateNowRaw).digest();
    const dateRegionKey = crypto.createHmac('sha256', dateKey).update('ca-central-1').digest();
    const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update('s3').digest();
    const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();

    const signature = crypto.createHmac('sha256', signingKey).update(base64Policy).digest('hex');


    var credentials = {
        url: s3Url,
        fields: {
            key: path,
            acl: readType,
            policy: base64Policy,
            'X-Amz-Credential': credentials,
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
            'X-Amz-Date': date,
            'X-Amz-Signature': signature,
            'Content-Type': request.type,
            success_action_status: 201
        },
        file_name: fileName

    };
    res.jsonp(credentials);
};
