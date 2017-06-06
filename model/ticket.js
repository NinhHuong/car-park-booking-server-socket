/**
 * Created by ninhh on 5/25/2017.
 */
var db = require('../database/dbConfig');

//add
exports.add = function(account_id, garage_id, booked_time, is_expired, checkin_time, checkout_time, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "INSERT INTO ticket(account_id, garage_id, booked_time, is_expired, checkin_time, checkout_time) VALUES ("  + account_id
            + ", " + garage_id + ", '" + booked_time + "', " + is_expired + ", '" + checkin_time + "', '" + checkout_time + "')";
        client.query(sql, function(err) {
            // db.endConnection();
            if(err) {
                return console.error('error running query', err);
            }
            callback({'response': 'Successfully add', 'res': true});
        });
    });
};

//get open ticket all
exports.getOpenTicketByAccount = function(token, callback) {
    db.getConnection(function (err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT ticket.id, ticket.booked_time, ticket.checkin_time, ticket.checkout_time, " +
            "ticket.garage_id, ticket.account_id, ticket.is_expired FROM ticket, account WHERE account.id = ticket.account_id " +
            "AND is_expired = 0 AND (checkin_time = '' OR checkout_time = '') AND account.token = '" + token + "'";
        client.query(sql, function(err, result) {
            // db.endConnection();
            if(err) {
                return console.error('error running query ticket', err);
            }

            sql = "SELECT DISTINCT garage.id, garage.name, garage.address, garage.picture, garage.total_slot, garage.busy_slot, garage.booking_slot, garage.location_x, location_y, location_z " +
                "FROM ticket, account, garage " +
                "WHERE account.id = ticket.account_id AND garage.id = ticket.garage_id " +
                "AND is_expired = 0 AND (checkin_time = '' OR checkout_time = '') " +
                "AND account.token = '" + token + "'";
            client.query(sql, function (err, result2) {
                if(err) {
                    return console.error('error running query garage', err);
                }

                callback({'result': true, 'data': {"ticketList" : result, "garageList" : result2}});
            })
        });
    })
};