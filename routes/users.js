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
    if (req.params.id == 'count'){
        // DATE FILTER
        if( (!(typeof initialDate === 'undefined')) && (!(typeof endDate === 'undefined')) ){
            User.count({ 'creationDate' : { '$gte' : initialDate , '$lt' : endDate } }, function (err, countDateUser) {
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                }
                // Success
                res.json({ message:"The count of users between dates", initialDate: initialDate, endDate: endDate
                    , data: countDateUser });
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
                res.json({ message:"The complete count of users", data: countUser });
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
        res.json({ message:"Login authenticated successfully", data: user });
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
            //res.send(err);
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

        // Get sent_at date
        //var sendAtDate = '2015-01-01 12:12:12';
        //logger.info(sendAtDate);

        // Send the email
        //logger.info(emailRequest);
        //logger.info(global.MANDRILLKEY);
        mandrillClient = new mandrill.Mandrill(global.MANDRILLKEY);
        var templateName = "recuperar";
        var template_content = [{
            "name": "CODIGO",
            "content": codeResult
        },{
            "name": "CURRENT_YEAR",
            "content": currentYear
        },{
            "name": "USEREMAIL",
            "content": emailRequest
        }
        ];
        var message = {
            "subject": "Recuperar Contraseña Estoy Bien App",
            "from_email": "soporte@estoybien.co",
            "from_name": "Soporte Estoy Bien App",
            "to": [{
                "email": emailRequest,
                "name": fullName,
                "type": "to"
            }],
            "merge_vars": [{
                "rcpt": emailRequest,
                "vars": [{
                    "name": "CODIGO",
                    "content": codeResult
                },{
                    "name": "CURRENT_YEAR",
                    "content": currentYear
                },{
                    "name": "USEREMAIL",
                    "content": emailRequest
                }]
            }]
        };
        var async = false;
        var ip_pool = "Main Pool";
        //var send_at = sendAtDate;
        mandrillClient.messages.sendTemplate({"template_name": templateName, "template_content": template_content,
            "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            //logger.info(result);
            //logger.info(result[0].status);
            var estado = result[0].status;
            var razonRechazo = result[0].reject_reason;
            if(estado == 'sent'){
                var saveReset = new UserReset();
                saveReset.name = fullName;
                saveReset.idUser = idUser;
                saveReset.email = emailRequest;
                saveReset.code = codeResult;

                saveReset.save(function(err){
                    // Check for errors and show message
                    if(err){
                        logger.error(err);
                        res.send(err);
                    }
                    // success
                    // success Email sent and user email validated
                    //logger.info(JSON.stringify(saveReset));
                    res.json({ message: 'Email sent successfully!' });
                });

            }else{

                // ERROR Email sent and user email validated
                res.json({ message: 'Error at send Email!', reason: razonRechazo });
            }
            /*
             [{
             "email": "recipient.email@example.com",
             "status": "sent",
             "reject_reason": "hard-bounce",
             "_id": "abc123abc123abc123abc123abc123"
             }]
             */
        }, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });

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

            /*
            // Password changed so we need to hash it
            bcrypt.genSalt(5, function (err, salt) {
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                    return;
                }

                bcrypt.hash(passRequest, salt, null, function (err, hash) {
                    // Check for errors and show message
                    if(err){
                        logger.error(err);
                        res.send(err);
                        return;
                    }

                    logger.info(hash);

                    user.password = JSON.stringify(hash);
                    //user.password = hash;

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
            */

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
    // TODO: rectificar insercion de array de objetos
    //user.rol = req.body.rol;
    //user.permissions = req.body.permissions;
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
        // TODO: rectificar insercion de array de objetos
        //user.rol = req.body.rol;
        //user.permissions = req.body.permissions;
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
