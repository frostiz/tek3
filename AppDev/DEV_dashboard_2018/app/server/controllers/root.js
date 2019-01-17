var express = require('express')
var router = new express.Router();

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

router.get('/', isLoggedIn, function (req, res) {
    res.render('home', {user: req.session.user});
});

module.exports = router;