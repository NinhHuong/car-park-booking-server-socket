/**
 * Created by ninhh on 5/16/2017.
 */

var crypto = require('crypto');
var rand = require('csprng');
var db = require('../database/dbConfig');

//register
exports.register = function(email, password, callback) {
    var salt = rand(160, 36);
    var newpass = salt + password;
    var token = crypto.createHash('sha512').update(email + rand).digest("hex");
    var hash_password = crypto.createHash('sha512').update(newpass).digest("hex");

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
                sql = "INSERT INTO account(email, hash_password, token, salt) VALUES ('" +
                    email + "', '" + hash_password + "', '" + token + "', '" + salt + "')";
                client.query(sql, function(err) {
                    // db.endConnection();
                    if(err) {
                        return console.error('error running query', err);
                    }
                    callback({'response': 'Successfully Registered', 'res': true});
                });
            } else {
                callback({'response': "Email already Registered", 'res': false});
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

        var sql = "SELECT * FROM account WHERE email = '" + email + "'";
       client.query(sql, function (err, result) {
           if(err) {
               return console.error('error running query', err);
           }

           if(result.length > 0) {
               var salt = result[0].salt;
               var newpass = salt + password;
               var hash_password = crypto.createHash('sha512').update(newpass).digest("hex");
               var password_db = result[0].hash_password;
               var token = result[0].token;
               if(password_db === hash_password) {
                   callback({'response':"Login Success", 'email':true, 'password':true, 'token':token});
               } else {
                   callback({'response':"Invalid Password", 'email':true, 'password':false, 'res':false});
               }
           } else {
               callback({'response':"User not exist", 'email':false, 'password':false, 'res':false});
           }
       });
    });
};