var express = require('express'),
    router = new express.Router(),
    request = require('request');

const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyBvPG_yZ4fNVH-ZrflvKDHWh5_bWtQOYzM');
const ytBaseUrl = 'https://www.youtube.com/watch?v='
const ytBasePlaylist = 'https://www.youtube.com/playlist?list='

router.post('/ytsearch', function (req, res) {
    if (!req.body.field || !req.body.number) {
        res.status(200).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        youtube.search(req.body.field, req.body.number).then(response => {
            let links = [];
            response.forEach(element => {
                element.videoUrl = ytBaseUrl + element.id
                links.push(element.videoUrl);
            });
            res.status(200).json({
                success: true,
                message: 'ok',
                data: response,
                links: links
            })
        })
    }
});

router.post('/ytplaylist', function (req, res) {
    if (!req.body.field) {
        res.status(200).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        var isPlaylist = false;
        var savedUrl, msg, newMsg;
        youtube.search(req.body.field, 20).then(response => {
            for (var i in response) {
                let element = response[i];
                if (element.type === 'playlist') {
                    element.playlistUrl = ytBasePlaylist + element.id;
                    savedUrl = element.playlistUrl;
                    isPlaylist = true;
                    break;
                }
            }
            if (isPlaylist === false) {
                res.status(200).json({
                    success: false,
                    message: 'Playlist does not exist'
                })
            } else {
                youtube.getPlaylist(savedUrl).then(playlist => {
                    msg = 'The playlist\'s title is ' + playlist.title;
                    playlist.getVideos().then(videos => {
                        newMsg = msg + ' This playlist has ' + videos.length + ' videos ! Here is the link : ' + savedUrl;
                        res.status(200).json({
                            success: true,
                            message: newMsg,
                            data: response
                        })
                    }).catch(console.log);
                });
            }
        })
    }
});

router.post('/ytsub', function (req, res) {
    if (!req.body.field) {
        res.status(200).json({
            success: false,
            message: 'Missing parameters'
        })
    } else {
        var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id="
        var newUrl = url + req.body.field + "&key=AIzaSyBvPG_yZ4fNVH-ZrflvKDHWh5_bWtQOYzM"
        request(newUrl, function (err, response, body) {
            var channelObj = JSON.parse(body);
            if (err) {
                res.status(200).json({
                    success: false,
                    message: 'Channel not found'
                })
            } else {
                var last = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBvPG_yZ4fNVH-ZrflvKDHWh5_bWtQOYzM&channelId=";
                var newLast = last + req.body.field + "&part=snippet,id&order=date&maxResults=20";
                request(newLast, function (err, response, body) {
                   var searchObj = JSON.parse(body);
                   if (err) {
                       return res.status(200).json({
                           success: false,
                           message: 'Video not found'
                       })
                   } else {
                       if (searchObj.error && searchObj.error.code === 400) {
                           return res.status(200).json({
                               success: false,
                               message: 'Invalid channel id'
                           });
                       }
                       var latestVideoId = searchObj.items[0].id.videoId;
                       var viewCount = channelObj.items[0].statistics.viewCount;
                       var subscriberCount = channelObj.items[0].statistics.subscriberCount;
                       var channelTitle = searchObj.items[0].snippet.channelTitle;
                       var message =  'Channel ' + channelTitle + ' have ' + viewCount + ' views and ' + subscriberCount + ' subscribers !';
                       res.status(200).json({
                           success: true,
                           message: message,
                           link: ytBaseUrl + latestVideoId
                       });
                   }
                });
            }
        })
    }
});

module.exports = router;