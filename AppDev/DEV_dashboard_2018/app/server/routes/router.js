module.exports = function(app, passport) {
    //POST
    app.use(require('../controllers/userController')(app, passport));

    app.use(require('../controllers/widget/weatherController'));
    app.use(require('../controllers/widget/youtubeController'));
    app.use(require('../controllers/widget/hogwartsController'));
    app.use(require('../controllers/widget/twitterController'));
    app.use(require('../controllers/widget/aboutController'));


    //GET
    app.use(require('../controllers/root'));
    app.use(require('../controllers/auth')(app, passport));
    app.use(require('../controllers/widget'));

    app.get('*', function(req, res, next) {
        res.send('error');
    });
};