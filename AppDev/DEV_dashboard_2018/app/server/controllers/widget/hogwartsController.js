var express = require('express'),
    router = new express.Router(),
    request = require('request');

router.post('/hogwarts', function (req, res) {
    if (!req.body.city) {
        res.status(400).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        var url = "https://hogwarts.epitest.eu/ajax/";
        var newUrl = url + req.body.city;
        request(newUrl, function (err, response, body) {
            try {
                var hogObj = JSON.parse(body);
                if (!err) {
                    var msg = `Gry: ${hogObj.gry}, Sly: ${hogObj.sly}, Rav: ${hogObj.rav}, Huf: ${hogObj.huf}`;
                    res.status(200).json({
                        success: true,
                        message: msg
                    })
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'City not found'
                    })
                }
            } catch (e) {
                res.status(200).json({
                    success: false,
                    message: 'City not found'
                })
            }
        })
    }
});

module.exports = router;