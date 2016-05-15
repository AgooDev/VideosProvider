/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required packages
var logger = require('../config/logger').logger;
var Notification = require('../models/notifications').Notifications;

// ENDPOINT: /notifications METHOD: GET
exports.getNotifications = function(req, res){
    // Use the 'Notification' model to find all Notification
    Notification.find(function (err, notification) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json(notification);
    });
};

// ENDPOINT: /notifications/:id METHOD: GET
exports.getNotificationById = function(req, res){
    // Use the 'Notification' model to find a single Notification
    Notification.findById(req.params.id, function (err, notification) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json(notification);
    });
};

// ENDPOINT: /notifications METHOD: POST
exports.postNotification = function (req, res) {
    // Create a new instance of the Notification model
    var notification = new Notification();

    // Set the Notification properties that came from the POST data
    notification.title = req.body.title;
    notification.description = req.body.description;
    notification.type = req.body.type;
    notification.image = req.body.image;
    notification.creationDate = Date.now();
    notification.enabled = true;

    notification.save(function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json({ message: 'Notification created successfully!', data: notification });
    });
};

// ENDPOINT: /notifications/:id METHOD: PUT
exports.putNotification = function(req, res){
    Notification.findById(req.params.id, function (err, notification) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }

        // Set the Notification properties that came from the PUT data
        notification.title = req.body.title;
        notification.description = req.body.description;
        notification.type = req.body.type;
        notification.image = req.body.image;
        notification.creationDate = req.body.creationDate;
        notification.enabled = req.body.enabled;

        notification.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'Notification updated successfully', data: notification });
        });
    });
};

// ENDPOINT: /notifications/:id METHOD: PATCH
exports.patchNotification = function(req, res){
    Notification.findById(req.params.id, function (err, notification) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }

        notification.enabled = req.body.enabled;
        notification.lastEditionDate = Date.now();

        notification.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            var message = '';
            if(notification.enabled === true){
                message = 'Notification enabled successfully';
            }else{
                message = 'Notification disbled successfully';
            }
            // success
            res.json({message: message, data: notification });
        });
    });
};

// ENDPOINT: /notifications/:id METHOD: DELETE
exports.deleteNotification = function(req, res){
    Notification.findByIdAndRemove(req.params.id, function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json({ message: 'Notification deleted successfully!' });
    });
};