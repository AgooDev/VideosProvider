/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define our Code schema
var CodeSchema   = new Schema({
    value: {
        type: String,
        required: true
    },
    redirectUri: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    },
    idClient: {
        type: String,
        required: true
    }
},{ versionKey: false });

// Export the Mongoose model
module.exports.Code = mongoose.model('Code', CodeSchema);