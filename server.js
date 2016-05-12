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
var environment = 'devLocal';
logger.info('Chose the work environment: ' + environment);
var config = require('./config/environment.json')[environment];
logger.info('API version: ' + config.version);

// Mongoose connection logger
var mongoDB = require('./config/mongodb');
mongoDB.setupMongoDB(config.nosqlDB);
