/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies
 */
var express             = require('express'),
    bodyParser          = require('body-parser'),
    errorHandler        = require('errorhandler'),
    favicon             = require('serve-favicon'),
    hbs                 = require('express-hbs'),
    methodOverride      = require('method-override'),
    moment              = require('moment'),
    path                = require('path'),
    session             = require('express-session'),
    passport            = require('passport'),

    logger              = require('./config/logger').logger,
    morgan              = require('morgan'),

    routes              = require('./routes/routes'),

    environment         = 'devLocal',
    config              = require('./config/environment.json')[environment],
    port                = config.port;

logger.info('Enviroment: ' + environment);

// Choose the environment of work
logger.info('Chose the work environment: ' + environment);
logger.info('API version: ' + config.version);

// Mongoose connection logger
var mongoDB = require('./config/mongodb');
mongoDB.setupMongoDB(config.mongoDB);

// Create our express application
var app = express();

// Config views and template engine.
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Favicon path.
app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride());

// Using body-parser in our application
// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// Import static files.
app.use(express.static(path.join(__dirname, 'public')));

// Use express session support since OAuth2orize requires it
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '1f u c4n r34d th1s u r34lly n33d t0 g37 l41d'
}));

// Set header 'X-Powered-By'
logger.info('API powered by: Agoo.com.co');
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'Agoo.com.co <www.agoo.com.co>');
    next();
});

// Use the passport package in our application
app.use(passport.initialize());

// Path to our public directory
app.use(express.static(__dirname + '/public'));

//ROUTER
//Create our Express router
var router  = express.Router();

// Setup all routes on express router
routes.setupRouter(router);

// Error handler available environment
var env = process.env.NODE_ENV || environment;
if ('devLocal' === env){
    app.use(errorHandler());
}

// Register all our routes with a prefix: /api or /v1
// This poject is created to be hosted in a subdomain dedicated to authentication and authorization
// Example of an URL with the prefix: auth.myDomain.com/v0
app.use(config.version, router);

// Start the server
app.listen(port);
logger.info('API running on http://localhost:' + port + config.version + '/');