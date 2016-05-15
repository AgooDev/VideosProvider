/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required packages
var logger = require('../config/logger').logger;
var DataModel = require('../models/publicVideos');
var Public = DataModel.PublicVideos;

// ENDPOINT: /public/videos METHOD: GET
exports.getPublicVideos = function(req, res){
    // Use the 'Public videos' model to find all Videos
    Public.find(function (err, public) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json(public);
    });
};

// ENDPOINT: /public/videos/:id METHOD: GET
exports.getPublicById = function(req, res){
    // Use the 'Public videos' model to find a single Notification
    Public.findById(req.params.id, function (err, public) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json(public);
    });
};

// ENDPOINT: /public/videos METHOD: POST
exports.postPublic = function (req, res) {
    // Create a new instance of the Public videos model
    var public = new Public();

    // Set the Notification properties that came from the POST data
    public.name = req.body.name;
    public.description = req.body.description;
    public.color = req.body.color;
    public.sound = req.body.sound;
    public.isPositive = req.body.isPositive;
    public.creationDate = Date.now();
    public.lastEditionDate = Date.now();
    public.idLang = req.body.idLang;
    public.enabled = true;

    public.save(function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json({ message: 'Public video created successfully!', data: public });
    });
};

// ENDPOINT: /public/videos/:id METHOD: PUT
exports.putPublic = function(req, res){
    Public.findById(req.params.id, function (err, public) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }

        // Set the Public video properties that came from the PUT data
        public.name = req.body.name;
        public.description = req.body.description;
        public.color = req.body.color;
        public.sound = req.body.sound;
        public.isPositive = req.body.isPositive;
        public.creationDate = req.body.creationDate;
        public.lastEditionDate = Date.now();
        public.idLang = req.body.idLang;
        public.enabled = req.body.enabled;

        public.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'Public video updated successfully', data: public });
        });
    });
};

// ENDPOINT: /public/videos/:id METHOD: PATCH
exports.patchPublic = function(req, res){
    Public.findById(req.params.id, function (err, public) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }

        public.enabled = req.body.enabled;
        public.lastEditionDate = Date.now();

        public.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            var message = '';
            if(public.enabled === true){
                message = 'Public video enabled successfully';
            }else{
                message = 'Public video disbled successfully';
            }
            // success
            res.json({message: message, data: public });
        });
    });
};

// ENDPOINT: /public/videos/:id METHOD: DELETE
exports.deletePublic = function(req, res){
    Public.findByIdAndRemove(req.params.id, function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
        }
        // success
        res.json({ message: 'Public video deleted successfully!' });
    });
};