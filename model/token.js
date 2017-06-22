/**
 * Created by ninhh on 5/28/2017.
 */
var db = require('../database/dbConfig');
var crypto = require('crypto');
var ticket = require('../model/ticket');

//add
exports.add = function(garage_id, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var token = Math.floor(Math.random() * 9999);
        var sql = "INSERT INTO token(garage_id, token_number) VALUES ("  + garage_id
            + ", '" + token + "')";
        client.query(sql, function(err) {
            // db.endConnection();
            if(err) {
                return console.error('error running query', err);
            }
            callback({'result': true});
        });
    });
};

//validate
exports.validate = function(ticket_id, token_input, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var sql = "SELECT token.id, token.token_number " +
            "FROM token, ticket, garage " +
            "WHERE garage.id = ticket.garage_id AND garage.id = token.garage_id AND token.is_expired = 0 AND ticket.id = " + ticket_id;
        // console.log(ticket_id);
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            // console.log(result);
            var sucess = false;
            for(var i=0; i< result.length; i++) {
                if(result[i].token_number === token_input) {
					sucess = true;
                    //update db
                    sql = "UPDATE token SET is_expired = 1 WHERE id = " + result[i].id;
                    client.query(sql, function (err) {
                        if(err) {
                            return console.error('error running query', err);
                        }
                    });
                    ticket.updateSuccessCheckinTicket(ticket_id, function (res) {
                        callback(res);
                    });

					break;
                }
            }
            if(!sucess) {
                callback({'result': true, 'data':{'is_valid_token': false}});
            }
        });
    });
};