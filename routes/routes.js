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
var Logger = require('../config/logger');
var logger = Logger.logger;
var moment = require('moment');

/**
 * setupRouter
 *
 * @description Configure all routes on express router
 *
 * @param {express.Router}      router      The varaible router used by the server
 */
function setupRouter (router){

    // logger for all request will first hits this middleware
    router.use(function (req, res, next) {
        var now = moment(new Date());

        var date = now.format('DD-MM-YYYY HH:mm');
        logger.info('%s %s %s', req.method, req.url, date);
        next();
    });

    /**
     *  Declare all routes
     */
    var authRoutes = require('./auth');
    var clientRoutes = require('./clients');
    var notificationRoutes = require('./notifications');
    var oauth2Routes = require('./oauth2');
    var publicVideos = require('./publicVideos');
    var userRoutes = require('./users');

    /**
     *  Document:  CLIENTS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /clients
    router.route('/clients')
        .get(authRoutes.isAuthenticated, clientRoutes.getClientByIdClient)
        .post(authRoutes.isAuthenticated, clientRoutes.postClient);

    // ENDPOINT: /clients/:id
    router.route('/clients/:id')
        .delete(authRoutes.isAuthenticated, clientRoutes.deleteClient);
    /**
     * ====================================================================
     */

    /**
     *  Document:  NOTIFICATIONS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /notifications
    router.route('/notifications')
        .get(authRoutes.isAuthenticated, notificationRoutes.getNotifications)
        .post(authRoutes.isAuthenticated, notificationRoutes.postNotification);

    // ENDPOINT: /notifications/:id
    router.route('/notifications/:id')
        .get(authRoutes.isAuthenticated, notificationRoutes.getNotificationById)
        .put(authRoutes.isAuthenticated, notificationRoutes.putNotification)
        .patch(authRoutes.isAuthenticated, notificationRoutes.patchNotification)
        .delete(authRoutes.isAuthenticated, notificationRoutes.deleteNotification);
    /**
     * ====================================================================
     */

    /**
     *  Document:  OAUTH2.JS
     *  Create endpoint handlers for oauth2 authorize
     */
        // ENDPOINT: /oauth2/authorize
    router.route('/oauth2/authorize')
        .get(authRoutes.isAuthenticated, oauth2Routes.authorization)
        .post(authRoutes.isAuthenticated, oauth2Routes.decision);

    // ENDPOINT: /oauth2/token
    router.route('/oauth2/token')
        .post(authRoutes.isClientAuthenticated, oauth2Routes.token);
    /**
     * ====================================================================
     */

    /**
     *  Document:  PUBLICVIDEOS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /public/videos
    router.route('/public/videos')
        .get(authRoutes.isAuthenticated, publicVideos.getPublicVideos)
        .post(authRoutes.isAuthenticated, publicVideos.postPublic);

    // ENDPOINT: /public/videos/:id
    router.route('/public/videos/:id')
        .get(authRoutes.isAuthenticated, publicVideos.getPublicById)
        .put(authRoutes.isAuthenticated, publicVideos.putPublic)
        .patch(authRoutes.isAuthenticated, publicVideos.patchPublic)
        .delete(authRoutes.isAuthenticated, publicVideos.deletePublic);
    /**
     * ====================================================================
     */

    /**
     *  Document:  USERS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /users
    router.route('/users')
        .get(authRoutes.isAuthenticated, userRoutes.getUsers)
        .post(authRoutes.isAuthenticated, userRoutes.postUser);

    // ENDPOINT: /users/:id
    // ENDPOINT: /users/count
    // ENDPOINT: /users/count?initialDate=yyyy-mm-dd&endDate=yyyy-mm-dd
    router.route('/users/:id')
        .get(authRoutes.isAuthenticated, userRoutes.getUserById)
        .put(authRoutes.isAuthenticated, userRoutes.putUser)
        .patch(authRoutes.isAuthenticated, userRoutes.patchUser)
        .delete(authRoutes.isAuthenticated, userRoutes.deleteUser);

    // ENDPOINT: /login
    router.route('/login')
        .get(authRoutes.isLoginAuthenticated, userRoutes.getLogin);

    // ENDPOINT: /password/reset
    router.route('/password/reset')
        .post(authRoutes.isAuthenticated, userRoutes.postPasswordReset);

    // ENDPOINT: /password/reset/:code
    router.route('/password/reset/:code')
        .patch(authRoutes.isAuthenticated, userRoutes.PatchPasswordReset);

    // ENDPOINT: /external/login
    router.route('/external/login')
        .get(authRoutes.isLoginAuthenticated, userRoutes.getExternalLogin);

    // ENDPOINT: /external/password/reset
    router.route('/external/password/reset')
        .post(authRoutes.isAuthenticated, userRoutes.postExternalPasswordReset);

    // ENDPOINT: /external/password/reset/:code
    router.route('/external/password/reset/:code')
        .patch(authRoutes.isAuthenticated, userRoutes.PatchExternalPasswordReset);

    /**
     * ====================================================================
     */

}

// Export the function that initialize all routes
module.exports.setupRouter = setupRouter;
