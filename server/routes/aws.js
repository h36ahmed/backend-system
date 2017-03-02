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

    switch(request.page) {
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

    var readType = 'private';

    var expiration = moment().add(5, 'm').toDate(); //15 minutes

    var s3Policy = {
        'expiration': expiration,
        'conditions': [{
                'bucket': aws.bucket
            },
            ['starts-with', '$key', path],
            {
                'acl': readType
            },
            {
              'success_action_status': '201'
            },
            ['starts-with', '$Content-Type', request.type],
            ['content-length-range', 2048, 10485760], //min and max
        ]
    };

    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign policy
    var signature = crypto.createHmac('sha1', aws.secret)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    var credentials = {
        url: s3Url,
        fields: {
            key: path,
            AWSAccessKeyId: aws.key,
            acl: readType,
            policy: base64Policy,
            signature: signature,
            'Content-Type': request.type,
            success_action_status: 201
        },
        file_name: fileName

    };
    res.jsonp(credentials);
};
