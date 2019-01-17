var express = require('express')
var router = new express.Router();

function checkUser(user) {
    if (!user.username) {
        return ({
            errors: {
                username: 'is required'
            }
        });
    }
    if (!user.password) {
        return ({
            errors: {
                password: 'is required'
            }
        });
    }
    return undefined;
}

module.exports = function (app, passport) {

    router.post('/login', function (req, res, next) {
        user = {
            username: req.body.username,
            password: req.body.password
        };
        errors = checkUser(user);
        if (errors)
            return res.status(422).json(errors);
        return passport.authenticate('local-login', (err, passportUser, info) => {
            if (err)
                return next(err);
            if (passportUser) {
                req.login(passportUser, function (err) {
                    if (err)
                        next(err);
                });
                return res.redirect('/');
            } else {
                req.logout();
                return res.redirect('/login');
            }
        })(req, res, next);
    });

    router.post('/register', function (req, res, next) {
        user = {
            username: req.body.username,
            password: req.body.password
        };
        errors = checkUser(user);
        if (errors)
            return res.status(422).json(errors);
        return passport.authenticate('local-register', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }, (err, passportUser, info) => {
            if (err)
                return next(err);
            if (passportUser) {
                return res.redirect('/login');
            } else {
                return res.redirect('/login');
            }
        })(req, res, next);
    });

    return router;
};
