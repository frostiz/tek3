var express = require('express'),
    router = new express.Router();

var ip = require("ip");
var addr = ip.address();
var time = Math.floor(new Date() / 1000);

router.get('/about.json', function (req, res) {
    res.status(200).json({
        client: {
            "host": addr,
        },
        server: {
            "current_time": time,
            "services": [{
                "name": "hogwarts",
                "widgets": [{
                    "name": "city scors",
                    "description ": "Affichage  des scores des maisons tek1 par ville",
                    "params ": [{
                        "name": "city",
                        "type": "string"
                    }]
                }]
            }, {
                "name": "weather",
                "widgets": [{
                    "name": "city temperature",
                    "description ": "Affichage  de la  temperature  pour  une  ville",
                    "params ": [{
                        "name": "city",
                        "type": "string"
                    }]
                }]
            }, {
                "name": "youtube",
                "widgets ": [{
                    "name": "youtube search",
                    "description ": "Recherche youtube",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }, {
                        "name": "number",
                        "type": "integer"
                    }]
                }, {
                    "name": "youtube playlist",
                    "description ": "Recherche de playlist",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }]
                }, {
                    "name": "youtube channel",
                    "description ": "Recherche de chaine",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }]
                }]
            }, {
                "name": "twitter",
                "widgets ": [{
                    "name": "twitter search",
                    "description ": "Recherche twitter",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }, {
                        "name": "number",
                        "type": "integer"
                    }]
                }, {
                    "name": "twitter follow",
                    "description ": "Suivre un compte twitter",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }]
                }, {
                    "name": "twitter post",
                    "description ": "Poster sur twitter",
                    "params ": [{
                        "name": "field",
                        "type": "string"
                    }]
                }]
            }]
        }
    })
});

module.exports = router;