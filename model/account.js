/**
 * Created by ninhh on 5/16/2017.
 */

var crypto = require('crypto');
var rand = require('csprng');
var nodemailer = require('nodemailer');
var db = require('../database/dbConfig');

//register
exports.register = function (email, password, roleID, callback) {
    var token = crypto.createHash('sha512').update(email + rand).digest("hex");

    db.getConnection(function (err, client) {
        if (err) {                                                                                                                                                                                                               
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (result.length === 0) {
                var temp = rand(16, 16);
                sql = "INSERT INTO account(email, hash_password, token, roleID,reset_str) VALUES ('" +
                    email + "', '" + password + "', '" + token + "', '" + roleID + "', '"+temp+"')";
                client.query(sql, function (err) {
                    // db.endConnection();
                    if (err) {
                        return console.error('error running query', err);
                    }
                    console.log("Register successful");
                    var mailOptions = {
                        from: "Auto Car Park",
                        to: email,
                        subject: "Reset Password ",
                        text: "Hello " + email + ".\nCode to validate account is " + temp + ".\n\nRegards,\nAuto Car-Park Team."
                    };

                    smtpTransport.sendMail(mailOptions, function (error) {
                        if (error) {
                            callback({
                                'result': false,
                                'data': {'mess': "Error"}
                            });
                            console.log(error);
                        } else {
                            callback({
                                'result': true,
                                'data': {'mess': "Successfull."}
                            });
                        }
                    });

                    callback({'result': true, 'data': {'mess': "Successfully Registered"}});
                });
            } else {
                console.log("Register fail")
                callback({'result': false, 'data': {'mess': "Email already Registered"}});
            }
        });
    });
};

//login
exports.login = function (email, password, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error running query', err);
        }
        console.log("Login with email: " + email);
        var sql = "SELECT * FROM account WHERE email = '" + email + "' and isVerify = 1";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (result.length > 0) {
                var password_db = result[0].hash_password;
                var token = result[0].token;
                if (password_db === password) {
                    console.log("Login successfull");
                    callback({'response': "Login Success", 'email': true, 'password': true, 'token': token});
                } else {
                    console.log("Login fail");
                    callback({'response': "Invalid Password", 'email': true, 'password': false, 'res': false});
                }
            } else {
                console.log("User not exist");
                callback({'response': "User not exist", 'email': false, 'password': false, 'res': false});
            }
        });
    });
};

//reset password
exports.reset_pass_init = function (email, callback) {
    console.log(">> Calling reset pass");
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        var temp = rand(16, 16);
        client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                if (result.length > 0) {
                    client.query("UPDATE account SET reset_str = '" + temp + "' WHERE email = '" + email + "'", function (err) {
                        if (err)
                            return console.error('error running query', err);

                        var mailOptions = {
                            from: "Auto Car Park",
                            to: email,
                            subject: "Reset Password ",
                            text: "Hello " + email + ".\nCode to reset your password is " + temp + ".\n\nRegards,\nAuto Car-Park Team."
                        };

                        smtpTransport.sendMail(mailOptions, function (error) {
                            if (error) {
                                callback({
                                    'result': false,
                                    'data': {'mess': "Error"}
                                });
                                console.log(error);
                            } else {
                                callback({
                                    'result': true,
                                    'data': {'mess': "Successfull."}
                                });
                            }
                        });
                    });
                }
                else {
                    callback({'result': false, 'data': {'mess': "Email Does not Exists."}});
                }
            }
        );
    });
}

//compare password
exports.compare_code = function (email, code, callback) {
    console.log(">> Calling compare pass");
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        console.log('client reset_str: ' + code);
        client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
            if (result.length > 0) {
                var temp = result[0].reset_str;
                if (temp === code) {
                    console.log("Client code match")
                    callback({'result': true, 'data': {'mess': "code match"}});
                } else {
                    console.log("Client code NOT match")
                    callback({'result': false, 'data': {'mess': "code not match"}});
                }
            } else {
                callback({'result': false, 'data': {'mess': "email error"}});
            }
        })
    })
}

//change password
exports.reset_pass_change = function (email, pass, callback) {
    console.log(">> Calling change pass");
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        console.log(email);
        client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
            if (result.length > 0) {
                var sql = "UPDATE account SET hash_password = '" + pass + "', reset_str = ''" +
                    "WHERE email = '" + email + "'";
                client.query(sql, function (err) {
                    if (err)
                        return console.error('error running query', err);
                    callback({'result': true, 'data': {'mess': "successfull."}});
                })
            } else {
                callback({'result': false, 'data': {'mess': "email not exist"}});
            }
        })
    });
};

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "carparkingauto@gmail.com",
        pass: "quocngay"
    }
});

