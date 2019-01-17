var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../server/models/userModel');
var configAuth = require('./auth.config');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-register', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            process.nextTick(function () {
                User.findOne({'local.username': username}, function (err, existingUser) {
                    if (err)
                        return done(err);
                    if (existingUser)
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    if (req.session.user) {
                        var user = req.session.user;

                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }
                    else {
                        var newUser = new User();

                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) { // callback with username and password from our form

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.username': username}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.displayName;
                                if (profile.email)
                                    user.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first
                                else
                                    user.facebook.email = "undefined";

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.displayName;
                            if (profile.email)
                                newUser.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first
                            else
                                newUser.facebook.email = "undefined";

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.displayName;
                    if (profile.email)
                        user.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first
                    else
                        user.facebook.email = "undefined";
                    user.facebook.email = profile.email;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });

        }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({
            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true

        },
        function (req, token, tokenSecret, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'twitter.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.twitter.token) {
                                user.twitter.token = token;
                                user.twitter.username = profile.username;
                                user.twitter.displayName = profile.displayName;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    var user = req.user; // pull the user out of the session

                    user.twitter.id = profile.id;
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            })
        })),


        // =========================================================================
        // GOOGLE ==================================================================
        // =========================================================================
        passport.use(new GoogleStrategy({
                clientID: configAuth.googleAuth.clientID,
                clientSecret: configAuth.googleAuth.clientSecret,
                callbackURL: configAuth.googleAuth.callbackURL,
                passReqToCallback: true
            },
            function (req, token, refreshToken, profile, done) {
                process.nextTick(function () {
                    if (!req.user) {
                        User.findOne({'google.id': profile.id}, function (err, user) {
                            if (err)
                                return done(err);

                            if (user) {
                                // if there is a user id already but no token (user was linked at one point and then removed)
                                if (!user.google.token) {
                                    user.google.token = token;
                                    user.google.name = profile.displayName;
                                    user.google.email = profile.emails[0].value; // pull the first email

                                    user.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, user);
                                    });
                                }

                                return done(null, user);
                            } else {
                                var newUser = new User();

                                newUser.google.id = profile.id;
                                newUser.google.token = token;
                                newUser.google.name = profile.displayName;
                                newUser.google.email = profile.emails[0].value; // pull the first email

                                newUser.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            }
                        });
                    } else {
                        // user already exists and is logged in, we have to link accounts
                        var user = req.user; // pull the user out of the session

                        user.google.id = profile.id;
                        user.google.token = token;
                        user.google.name = profile.displayName;
                        user.google.email = profile.emails[0].value; // pull the first email

                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }
                });
            }))
};