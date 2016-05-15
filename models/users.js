/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required packages
var logger = require('../config/logger').logger;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define basic User schema
var UserSchema = new Schema({
    name: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: Date,
    enabled: Boolean
},{ versionKey: false });

// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if(!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            // Check for errors and show message
            if(err){
                logger.error(err);
                return callback(err);
            }

            user.password = hash;
            callback();
        });
    })
});

UserSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            return callback(err);
        }
        // Make the comparation and send the answer
        callback(null, isMatch);
    });
};

// Export the Mongoose model
module.exports.User = mongoose.model('User', UserSchema);