var cryptojs = require('crypto-js');

module.exports = function(models) {
    return {
        requireAuthentication: function(req, res, next) {
            var token = req.get('Auth') || '';
            models.tokens.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function(tokenInstance){
                if (!tokenInstance) {
                    throw new Error();
                }
                req.token = tokenInstance;
                return models.users.findByToken(token);
            }).then(function(user) {
                req.user = user;
                next();
            }).catch(function (){
                res.status(401).send();
            });
        }
    }
};
