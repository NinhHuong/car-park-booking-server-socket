/**
 * Created by ninhh on 5/16/2017.
 */

var crypto = require('crypto');
var rand = require('csprng');
var nodemailer = require('nodemailer');
var db = require('../database/dbConfig');

//register
exports.register = function(email, password, salt, roleID, callback) {
    var token = crypto.createHash('sha512').update(email + rand).digest("hex");

    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        client.query(sql, function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            if(result.length === 0) {
                sql = "INSERT INTO account(email, hash_password, token, salt, roleID) VALUES ('" +
                    email + "', '" + password + "', '" + token + "', '" + salt + "', '"+ roleID +"')";
                client.query(sql, function(err) {
                    // db.endConnection();
                    if(err) {
                        return console.error('error running query', err);
                    }
                    callback({'result':true, 'data':{'mess':"Successfully Registered"}});
                });
            } else {
                callback({'result':false, 'data':{'mess':"Email already Registered"}});
            }
        });
    });
};

//login
exports.login = function (email, password, callback) {
    db.getConnection(function (err, client) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log("Login with email: "+email+" password: "+password);
        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        client.query(sql, function (err, result) {
            if(err) {
               return console.error('error running query', err);
            }

            if(result.length > 0) {
                var password_db = result[0].hash_password;
                var token = result[0].token;
                if(password_db === password) {
                    console.log("Login successfull");
                    callback({'response':"Login Success", 'email':true, 'password':true, 'token':token});
                } else {
                    console.log("Login fail");
                    callback({'response':"Invalid Password", 'email':true, 'password':false, 'res':false});
                }
            } else {
                console.log("User not exist");
                callback({'response':"User not exist", 'email':false, 'password':false, 'res':false});
            }
        });
    });
};

exports.login_request = function (email, callback) {
    db.getConnection(function (err, client) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log("Login request from: "+email);
        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        client.query(sql, function (err, result) {
            if(err) {
               return console.error('error running query', err);
            }

            if(result.length > 0) {
                var salt = result[0].salt;
                console.log("Response salt: "+salt);
				callback(salt);
            } else {
                console.log("User not exist");
                callback({'response':"User not exist"});
            }
        });
    });
};

//reset password
exports.reset_pass_init = function(email, callback) {
    db.getConnection(function (err, client) {
        if(err) {
            return console.error('error connecting', err);
        }

        var temp = rand(24, 24);
        client.query("UPDATE account SET reset_str = '" + temp + "' WHERE email = '" + email +"'", function (err) {
            if(err)
                return console.error('error running query', err);

            client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                if(result.length > 0) {
                    var mailOptions = {
                        from: "Ninh Huong <huongntmse03077@fpt.edu.vn>",
                        to: email,
                        subject: "Reset Password ",
                        text: "Hello " + email + ".\nCode to reset your Password is " + temp + ".\n\nRegards,\nHuongntmse03077,\nAuto Car-Park Team."
                    };

                    smtpTransport.sendMail(mailOptions, function(error){
                        if(error){
                            callback({'result':false, 'data':{'mess':"Error While Resetting password. Try Again !"}});
                            console.log(error);
                        }else{
                            callback({'result':true, 'data':{'mess':"Check your Email and enter the verification code to reset your Password."}});
                        }
                    });
                } else{
                    callback({'result':false, 'data':{'mess':"Email Does not Exists."}});
                }
            });
        });
    });
};

//change password
exports.reset_pass_change = function(email, code, npass, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        console.log(email);
        client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
            if(result.length > 0) {
                var temp = result[0].reset_str;
                var salt =rand(160, 36);
                var newpass1 = salt + npass;
                var hashed_password = crypto.createHash('sha512').update(newpass1).digest("hex");

                if(temp === code) {
                    // npass.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && npass.length > 4 && npass.match(/[0-9]/) && npass.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)
                    var sql = "UPDATE account SET hash_password = '" + hashed_password + "', salt = '" + salt + "', reset_str = ''" +
                        "WHERE email = '" + email + "'";
                    client.query(sql, function (err) {
                        if(err)
                            return console.error('error running query', err);

                        callback({'result':true, 'data':{'mess':"Password Sucessfully Changed."}});
                    })
                } else {
                    callback({'result':false, 'data':{'mess':"Code does not match. Try Again !"}});
                }
            } else {
                callback({'result':false, 'data':{'mess':"Email is not exist"}});
            }
        })
    });
};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "carparkingauto@gmail.com",
        pass: "quocngay"
    }
});