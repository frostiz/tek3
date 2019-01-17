var express = require('express');
var router = new express.Router();

module.exports = function(app, passport) {

    router.get('/login', function(req, res, next) {
        res.render('login');
    });

    router.get('/auth/facebook', function (req, res, next) {
        return passport.authenticate('facebook', {
            scope: ['public_profile', 'email']
        }, (err, passportUser, info) => {

        })(req, res, next);
    });

    router.get('/auth/facebook/callback', function (req, res, next) {
        return passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }, (err, passportUser, info) => {
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

    //Twitter auth
    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback', function(req, res, next) {
        return passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        }, (err, passportUser, info) => {
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

    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    router.get('/auth/google/callback', function(req, res, next) {
        return passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }, (err, passportUser, info) => {
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

    router.get('/logout', function(req, res, next) {
        /*req.session.user = {
            local: {},
            facebook: {},
            twitter: {},
            google: {},
            global: {}
        };*/
        //req.user = undefined;
        req.logout();
        res.redirect('/login');
    });

    router.get('/auth/user', function(req, res, next) {
        if (req.isAuthenticated()) {
            return res.status(200).json({
                success: true,
                user: req.user
            });
        }
        return res.status(400).json({
            success: false
        })
    });

    return router;
};