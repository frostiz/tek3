var express = require('express');
var router = new express.Router();
var User = require('../models/userModel');
var Widget = require('../models/widgetModel');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

router.get('/widget/weather', isLoggedIn, function (req, res) {
    res.send('Weather widget');
});

router.get('/widget/hogwarts', isLoggedIn, function (req, res) {
    res.send('Hogwarts widget');
});

router.get('/widget/reddit', isLoggedIn, function (req, res) {
    res.send('reddit widget');
});

router.get('/widget/youtube', isLoggedIn, function (req, res) {
    res.send('youtube widget');
});

router.post('/addWidget', isLoggedIn, function(req, res) {
    if (!req.body.data) {
        return res.json({success: false, message: 'Missing data'});
    }
    var widget = new Widget({
        service: req.body.data.service,
        name: req.body.data.widget,
        param: req.body.data.param,
        refreshTime: req.body.data.refreshTime
    });
    User.findByIdAndUpdate(req.user._id,
        {
            $push: { "widgets": widget }
        },
        { safe: true, upsert: true },
        function (err, model) {
            if (err) {
                return res.json({success: false, message: err});
            }
            return res.status(200).json({
                success: true,
                data: widget
            });
        }
    );
});

router.post('/deleteWidget', isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err)
            return res.status(200).json({'success': false, 'error': err});
        if (!user) {
            return res.status(200).json({'success': false, 'error': 'User not found'});
        } else {
            let widget = user.widgets.id(req.body.id);
            if (widget) {
                widget.remove();
                user.save(function(err) {
                    if (err)
                        return res.status(200).json({'success': false, 'error': err});
                    return res.status(200).json({'success': true});
                });
            } else {
                return res.status(200).json({'success': false, 'error': 'Widget is not attribued to this user'});
            }
        }
    });

});

router.post('/loadWidgets', isLoggedIn, function (req, res) {
    User.findById(req.user._id, function(err, user) {
        let data = [];

        for (var i in user.widgets) {
            if (user.widgets[i].service === req.body.service) {
                data.push(user.widgets[i]);
            }
        }
        res.status(200).json(data);
    });
});

module.exports = router;