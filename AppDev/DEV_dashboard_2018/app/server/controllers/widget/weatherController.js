var express = require('express'),
    weather = new express.Router(),
    request = require('request');

var apiKey = '28fe1c92ac3341005cc20b4656960b90';
var url = `http://api.openweathermap.org/data/2.5/weather?q=`

weather.post('/weather', function (req, res) {
    if (!req.body.city) {
        res.status(400).json({
            success: false,
            message: 'No city given'
        })
    } else {
        var newCity = req.body.city.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        var newUrl = url + newCity + `&units=metric&appid=${apiKey}`;
        request(newUrl, function (err, response, body) {
            var weatherObj = JSON.parse(body);
            if (weatherObj.cod !== 200) {
                if (weatherObj.cod === 429) {
                    return res.status(200).json({
                        success: false,
                        message: 'Too much requests: temporary blocked'
                    })
                }
                res.status(200).json({
                    success: false,
                    message: 'City not found'
                })
            } else {
                var message = `It's ${weatherObj.main.temp} degrees in ${weatherObj.name}!`;
                res.status(200).json({
                    success: true,
                    message: message,
                    data: weatherObj
                })
            }
        })
    }
});

module.exports = weather;