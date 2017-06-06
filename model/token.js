/**
 * Created by ninhh on 5/28/2017.
 */
var db = require('../database/dbConfig');
var crypto = require('crypto');

//add
exports.add = function(ticket_id, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var token = Math.floor(Math.random() * 9999);
        var sql = "INSERT INTO token(ticket_id, token_number) VALUES ("  + ticket_id
            + ", '" + token + "')";
        client.query(sql, function(err) {
            // db.endConnection();
            if(err) {
                return console.error('error running query', err);
            }
            callback({'res': true});
        });
    });
};

//validate
exports.validate = function(ticket_id, token_input, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var sql = "SELECT * FROM token WHERE ticket_id = " + ticket_id + " and is_expired = 0" ;
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            if(result[0].token_number === token_input) {
                //update db
                sql = "UPDATE token SET is_expired = 1 WHERE id = " + result[0].id;
                client.query(sql, function (err, result) {
                    if(err) {
                        return console.error('error running query', err);
                    }
                    callback({'res': true, 'data':{'is_valid_token': true}});
                })
            } else {
                callback({'res': true, 'data':{'is_valid_token': false}});
            }
        });
    });
};