/**
 * Created by ninhh on 5/16/2017.
 */

var crypto = require('crypto');
var rand = require('csprng');
var nodemailer = require('nodemailer');
var db = require('../database/dbConfig');
var security = require('../model/security');
var user = require('../model/user');
var db_error = require('../database/db_error');
const table_name = 'account';

//Register
exports.Register = function (email, password, roleID, callback) {
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
                    email + "', '" + password + "', '" + token + "', '" + roleID + "', '" + temp + "')";
                client.query(sql, function (err) {
                    // db.endConnection();
                    if (err) {
                        return console.error('error running query', err);
                    }
                    console.log("Register successful");
                    sql = "SELECT * FROM " + table_name + " WHERE email = '" + email + "'";
                    client.query(sql, function (err, result) {
                        // db.endConnection();
                        if (err) {
                            return console.error('error running query', err);
                        }
                        if (result.length > 0) {
                            user.AddByAccountId(result[0].id, function () {
                            });
                        }
                    });

                    var mailOptions = {
                        from: "Auto Car Park",
                        to: email,
                        subject: "Create new account ",
                        text: "Hello " + email + ".\nCode to validate account is " + temp + ".\n\nRegards,\nAuto Car-Park Team."
                    };

                    smtpTransport.sendMail(mailOptions, function (error) {
                        if (error) {
                            callback({
                                "result": false,
                                "mess": "Error"
                            });
                            console.log(error);
                        } else {
                            callback({
                                "result": true,
                                "mess": "Successfull."
                            });
                        }
                    });

                    callback({"result": true, "data": "Successfully Registered"});
                });
            } else {
                console.log("Register fail");
                callback({"result": false, "mess": "email_registered"});
            }
        });
    });
};

//Register for security
exports.RegisterForSecurity = function (email, password, accountAdminID, callback) {
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
                    email + "', '" + password + "', '" + token + "', '" + "3" + "', '" + temp + "')";
                console.log(sql);
                client.query(sql, function (err) {
                    // db.endConnection();
                    if (err) {
                        return console.error('error running query', err);
                    }
                    console.log("Register successful");
                    var mailOptions = {
                        from: "Auto Car Park",
                        to: email,
                        subject: "Create new account ",
                        text: "Hello " + email + ".\nCode to validate account is " + temp + ".\n\nRegards,\nAuto Car-Park Team."
                    };

                    smtpTransport.sendMail(mailOptions, function (error) {
                        if (error) {
                            callback({
                                "result": false,
                                "mess": "Error"
                            });
                            console.log(error);
                        } else {
                            callback({
                                "result": true,
                                "mess": "Successfull."
                            });
                        }
                    });
                    sql = "SELECT * FROM " + table_name + " WHERE email = '" + email + "'";
                    client.query(sql, function (err, result) {
                        // db.endConnection();
                        if (err) {
                            return console.error('error running query', err);
                        }
                        if (result.length > 0) {
                            user.AddByAccountId(result[0].id, function () {
                            });
                        }
                    });

                    var garageID, accountSecurityID;
                    sql = "SELECT * FROM garage where accountID = '" + accountAdminID + "'";
                    client.query(sql, function (err, result) {
                        // db.endConnection();
                        if (err) {
                            return console.error('error running query', err);
                        }

                        garageID = result[0].id;

                        sql = "SELECT * FROM account where email = '" + email + "'";
                        client.query(sql, function (err, result) {
                            // db.endConnection();
                            if (err) {
                                return console.error('error running query', err);
                            }
                            accountSecurityID = result[0].id;

                            security.Add(accountSecurityID, garageID, callback);
                        });
                    });
                });
            } else {
                console.log("Register fail");
                callback({"result": false, "mess": "Email already Registered"});
            }
        });
    });
};

//register for admin
exports.RegisterForAdmin = function (email, password, callback) {
    var token = crypto.createHash('sha512').update(email + rand).digest("hex");
    db.getConnection(function (err, client) {
        if (err) {
            db_error.errorDBConnection(err, callback);
        }

        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        client.query(sql, function (err, result) {
            if (err) db_error.errorSQL(err, callback);

            if (result.length === 0) {
                var temp = rand(16, 16);

                sql = "INSERT INTO account(email, hash_password, token, roleID,reset_str) VALUES ('" +
                    email + "', '" + password + "', '" + token + "', '" + "2" + "', '" + temp + "')";

                client.query(sql, function (err) {
                    if (err) db_error.errorSQL(err, callback);

                    sql = "SELECT * FROM " + table_name + " WHERE email = '" + email + "'";
                    client.query(sql, function (err, result) {
                        // db.endConnection();
                        if (err) {
                            return console.error('error running query', err);
                        }
                        if (result.length > 0) {
                            user.AddByAccountId(result[0].id, function () {
                            });
                        }
                    });

                    console.log("Register successful");
                    var mailOptions = {
                        from: "Auto Car Park",
                        to: email,
                        subject: "Create new account ",
                        text: "Hello " + email + ".\nCode to validate account is " + temp + ".\n\nRegards,\nAuto Car-Park Team."
                    };

                    smtpTransport.sendMail(mailOptions, function (error) {
                        if (error) {
                            callback({
                                "result": false,
                                "mess": "Error"
                            });
                            console.log(error);
                        } else {
                            sql = "SELECT * FROM account WHERE email = '" + email + "'";
                            client.query(sql, function (err, result) {
                                if (err) db_error.errorSQL(err, callback);

                                callback({
                                    "result": true, "data": ({"accountAdminID": result[0].id}), "mess": "Successfull."
                                });
                            });
                            callback({
                                "result": true,
                                "mess": "Successfull."
                            });
                        }
                    });
                });
            } else {

                callback({"result": false, data: "", "mess": "Email already Registered"});
            }
        });
    });
};

//Login
exports.Login = function (email, password, callback) {
    db.getConnection(function (err, client) {
            if (err) {
                return console.error('error running query', err);
            }
            console.log("Login with email: " + email);
            var sql = "SELECT * FROM account WHERE email = '" + email + "'";
            client.query(sql, function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }

                if (result.length > 0) {
                    var password_db = result[0].hash_password;
                    var id = result[0].id;
                    var token = result[0].token;
                    var verify = result[0].isVerify;
                    var role = result[0].roleID;
                    var isLogin = result[0].isLogin;
                    if (password_db === password && isLogin === 0) {
                        console.log("Login successfull");
                        callback({
                            "result":true,
                            "response": "Login Success",
                            "id": id,
                            "email": true,
                            "password": true,
                            "is_verify": verify,
                            "token": token,
                            "role": role,
                            "isLogin": isLogin
                        });

                        var none;
                        updateIsLogin(id, 1,function (none) {
                        });
                    } else {
                        console.log('Login fail');
                        callback({
                            "response": "Login fail",
                            "id": id,
                            "email": true,
                            "password": false,
                            "is_verify": verify,
                            "token": token,
                            "role": role,
                            "res": false,
                            "isLogin": isLogin
                        });
                    }

                }
                else {
                    console.log('User not exist');
                    callback({
                        "response": "User not exist",
                        "id": "",
                        "email": false,
                        "password": false,
                        "token": "",
                        "role": "",
                        "res": false,
                        "is_verify": "1",
                        "isLogin": 0
                    });
                }
            });
        }
    )
    ;
};

//CheckToken
exports.CheckToken = function (token, callback) {
    db.getConnection(function (err, client) {
            if (err) {
                return console.error('error running query', err);
            }
            console.log('Login with remember token');
            var sql = "SELECT * FROM account WHERE token = '" + token + "'";
            client.query(sql, function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }

                if (result.length > 0) {
                    var id = result[0].id
                    var tokenDb = result[0].token;
                    var role = result[0].roleID;
                    if (tokenDb === token) {
                        console.log('Remember me successfull');
                        callback({
                            "id": id,
                            "response": "Remember Success",
                            "result": true,
                            "role": role
                        });
                    } else {
                        console.log('Remember fail');
                        callback({"response": "Invalid Password", "result": false, "res": false});
                    }

                }
                else {
                    console.log('User not exist');
                    callback({"response": "User not exist", "result": false, "res": false});
                }
            });
        }
    )
    ;
};

//update user id
exports.UpdateByUserId = function (accountId, userId, callback) {
    console.log('>> Calling update userId');
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        client.query("SELECT * FROM " + table_name + " WHERE id = '" + accountId, function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                if (result.length > 0) {
                    client.query("UPDATE " + table_name + " SET userID = '" + userId + "' WHERE id = " + accountId, function (err) {
                        if (err) {
                            return console.error('error running query', err);
                        }
                        callback({"result": true, "data": "", "mess": "Update userId = " + userId + "success"});
                    });
                }
                else {
                    callback({"result": false, "data": "", "mess": "Update userId = " + userId + "failed"});
                }
            }
        );
    });
};

function updateIsLogin(accountId, newIsLogin, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }

        client.query("SELECT * FROM " + table_name + " WHERE id = '" + accountId+"'", function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                if (result.length > 0) {
                    client.query("UPDATE " + table_name + " SET isLogin = '" + newIsLogin + "' WHERE id = '" + accountId+"'", function (err) {
                        if (err) {
                            callback({result: false, data:"", mess: ""});
                            return console.error('error running query', err);
                        }
                        callback({result: true, data:"", mess: ""});
                        return console.error('Update status cussessfull with account ' + accountId + ' and new status is' + newIsLogin);
                    });
                }
                else {
                    callback({result: false, data:"", mess: ""});
                    return console.error('Cant find account id ' + accountId);
                }
            }
        );
    });
}

//Log out
exports.LogOut = function (accountId, callback) {
    console.log('>> Calling logout accountId ' + accountId);
    updateIsLogin(accountId, 0, callback);
};

//reset password
exports.ResetPassInit = function (email, callback) {
    console.log('>> Calling reset pass');
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
                                    "result": false,
                                    "data": {"mess": "Error"}
                                });
                                console.log(error);
                            } else {
                                callback({
                                    "result": true,
                                    "data": {"mess": "Successfull."}
                                });
                            }
                        });
                    });
                }
                else {
                    callback({"result": false, "data": {"mess": "Email Does not Exists."}});
                }
            }
        );
    });
};

//compare password
exports.CompareCode = function (email, code, callback) {
    console.log('>> Calling compare pass');
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error connecting', err);
        }
        console.log('client reset_str: ' + code);
        client.query("SELECT * FROM account WHERE email = '" + email + "'", function (err, result) {
            if (result.length > 0) {
                var temp = result[0].reset_str;
                if (temp === code) {
                    client.query("UPDATE account SET isVerify = '" + 1 + "' WHERE email = '" + email + "'", function (err) {
                        if (err)
                            return console.error('error running query', err);
                        console.log("Client code match");
                        callback({"result": true, "data": {"mess": "code match"},"id":result[0].id});
                    });
                } else {
                    console.log("Client code NOT match");
                    callback({"result": false, "data": {"mess": "code not match"}});
                }
            } else {
                callback({"result": false, "data": {"mess": "email error"}});
            }
        })
    })
};

//change password
exports.ResetPassChange = function (email, pass, callback) {
    console.log('>> Calling change pass');
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
                    callback({"result": true, "data": {"mess": "successfull."}});
                })
            } else {
                callback({"result": false, "data": {"mess": "email not exist"}});
            }
        })
    });
};

exports.GetAccountIDByEmail = function (email, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
        if (err) return db_error.errorSQL(sql, callback, err);
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            //console.log(result[0]);
            var id = result[0].id
            var role = result[0].roleID;
            callback({"id": id, "role": role});
        });
    });
};

exports.RemoveAccountByID = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
        if (err) return db_error.errorSQL(sql, callback, err);
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            callback({"result": true, "data": "", "mess": "Delete successful."});
        });
    });
};

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "carparkingauto@gmail.com",
        pass: "quocngay"
    }
});
