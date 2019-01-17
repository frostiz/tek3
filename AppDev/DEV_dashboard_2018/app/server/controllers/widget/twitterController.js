var express = require('express'),
    router = new express.Router();

var Twit = require('twit');
var T = new Twit({
    consumer_key:         'PcRyx4ppFd1VcPlWa6ZPXnS5i',
    consumer_secret:      'KrlNTyiBkPl0bwq1vvBeFbdLtE9VJ6sDm5dmiEaHKNbL03dkRQ',
    access_token:         '2291815884-qyPJoeuqIAhHX0zmImGaLn4rbSXmXZpdlOJ2V30',
    access_token_secret:  's7NtgE1XeiPbXcDvDBtp6sKIfofEn3EOSoGNl0ypougeM',
})

var twitBase = "https://twitter.com/aadil75/status/";

router.post('/twitsearch', function (req, res) {
    if (!req.body.field || !req.body.number) {
        res.status(400).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        var params = {
            q: '',
            count: 100
        };
        params.q = req.body.field;
        params.count = req.body.number;
        T.get('search/tweets', params, searchedData);
        function searchedData(err, data, response) {
            var twits = [];
            for (var i in data.statuses) {
                twits[i] = twitBase + data.statuses[i].id_str;
            }
            res.status(200).json({
                success: true,
                data: twits
            })
        }
    }
})

router.post('/twitpost', function (req, res) {
    if (!req.body.field) {
        res.status(400).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        var tweet = {
            status: '' };
        tweet.status = req.body.field;
        T.post('statuses/update', tweet, tweeted);
        function tweeted(err, data, response) {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: 'Couldn\'t post tweet'
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "You have tweet " + req.body.field
                })
            }
        }
    }
})

router.post('/twituser', function (req, res) {
    if (!req.body.field) {
        res.status(400).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        T.get('followers/ids', { screen_name: req.body.field },  function (err, data, response) {
            if (err) {
                res.status(200).json({
                    success: false,
                    message: 'User not found'
                })
            } else {
                var array = [];
                array = data.ids;
                var len = array.length;
                res.status(200).json({
                    success: true,
                    message: len
                })
            }
        })
    }
})

module.exports = router;