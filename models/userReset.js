/**
 * Copyright (c) 2016-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

// Load required package
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserResetSchema = new Schema({
    name: String,
    idUser: Schema.Types.ObjectId,
    email: String,
    code: String
},{ versionKey: false });

// Export the Mongoose model
module.exports.UserReset = mongoose.model('UserReset', UserResetSchema);