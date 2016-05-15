/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required packages
var logger = require('../config/logger').logger;
var User = require('../models/users').Users;
var UserReset = require('../models/userReset').UserReset;

// ENDPOINT: /users METHOD: GET
exports.getUsers = function(req, res){
  
    // Use the 'User' model to find all users
    User.find(function (err, users) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(users);
    });
};

// ENDPOINT: /users/:id METHOD: GET
// ENDPOINT: /users/count METHOD: GET
// ENDPOINT: /users/count?initialDate=yyyy-mm-dd&endDate=yyyy-mm-dd METHOD: GET
exports.getUserById = function(req, res){
    var initialDate = req.query.initialDate;
    var endDate = req.query.endDate;
    // COUNT ENDPOINT CALLED
    if (req.params.id === 'count'){
        // DATE FILTER
        if( (!(typeof initialDate === 'undefined')) && (!(typeof endDate === 'undefined')) ){
            User.count({ 'creationDate' : { '$gte' : initialDate , '$lt' : endDate } }, function (err, countDateUser) {
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                }
                // Success
                res.json({ message:'The count of users between dates', initialDate: initialDate,
                    endDate: endDate, data: countDateUser });
            });
            return;
        }else{
            User.count({}, function (err, countUser) {
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                }
                // Success
                res.json({ message:'The complete count of users', data: countUser });
            });
        }
        return;
    }

    // Use the 'User' model to find all users
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(user);
    });
};

// ENDPOINT: /login METHOD: GET
exports.getLogin = function (req, res) {
    // Use the 'User' model to find all users
    User.findById(req.user._id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message:'Login authenticated successfully', data: user });
    });
};

// ENDPOINT: /password/reset METHOD: POST
exports.postPasswordReset = function (req, res) {
    var emailRequest = req.body.email;
    // Use the 'User' model to find one user with this email address
    // Validate email provided exist on database
    User.find({ email: emailRequest }, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.json({ message: 'Email provided doesn`t Exists'});
            return;
        }

        // Get User data values
        var idUser = user[0]._id;
        var fullName = user[0].name + ' ' + user[0].lastName;

        // Generate random code, with the size of 8 characters mixing numbers and letters
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var sizeCode = 8;
        var codeResult = '';
        for (var i = sizeCode; i > 0; --i) codeResult += chars[Math.round(Math.random() * (chars.length - 1))];
        //logger.info(codeResult);

        //Get current year
        var currentYear = new Date().getFullYear();
        //logger.info(currentYear);


        // TODO: Agregar soporte para restaurar la contraseña, para externos y para el servicio
    });
};

// ENDPOINT: /password/reset/:code METHOD: PATCH
exports.PatchPasswordReset = function (req, res) {
    var codeRequest = req.params.code;
    // Use the 'UserReset' model to find one user with this email address
    UserReset.find({code: codeRequest}, function (err, userReset) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.json({ message: 'Code doesn`t exists'});
            res.send(err);
            return;
        }

        // Change the password for the new sent
        //var emailRequest = req.body.email;
        //logger.info(emailRequest);
        var passRequest = req.body.password;
        logger.info(passRequest);
        //logger.info(userReset[0].idUser);
        var idUserRequest = userReset[0]._id;

        // Find the user and update de password value
        User.findById(userReset[0].idUser, function (err, user) {
            if(err){
                logger.error(err);
                res.send(err);
                return;
            }

            // Change the password value
            user.password = passRequest;

            user.save(function(err){
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                    return;
                }
                // Now deleted the code from the collection
                UserReset.findByIdAndRemove(idUserRequest, function(err){
                    // Check for errors and show message
                    if(err){
                        logger.error(err);
                        res.send(err);
                        return;
                    }
                    // success
                    // success
                    res.json({ message: 'User password changed and code: ' + codeRequest +' deleted successfully!' });
                });
            });

        });
    });
};

// ENDPOINT: /users METHOD: POST
exports.postUser = function (req, res) {
    // Create a new instance of the User model
    var user = new User();

    // Set the User properties that came from the POST data
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.creationDate = Date.now();
    user.enabled = true;

    user.save(function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        //Success
        res.json({ message: 'User created successfully!', data: user });
    });
};

// ENDPOINT: /users/:id METHOD: PUT
exports.putUser = function(req, res){
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        // Set the User properties that came from the PUT data
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.creationDate = req.body.creationDate;
        user.enabled = req.body.enabled;
        user.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'User updated successfully', data: user });
        });
    });
};

// ENDPOINT: /users/:id METHOD: PATCH
exports.patchUser = function(req, res){
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        user.enabled = req.body.enabled;

        user.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
                return;
            }
            var message = '';
            if(user.enabled === true){
                message = 'User enabled successfully';
            }else{
                message = 'User disbled successfully';
            }
            // success
            res.json({message: message, data: user });
        });
    });
};

// ENDPOINT: /users/:id METHOD: DELETE
exports.deleteUser = function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message: 'User deleted successfully!' });
    });
};
