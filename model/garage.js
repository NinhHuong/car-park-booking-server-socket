/**
 * Created by ninhh on 5/24/2017.
 */
var db = require('../database/dbConfig');

//add
exports.add = function(name, address, picture, total_slot, busy_slot, booking_slot, location_x, location_y, location_z, callback) {
    db.getConnection(function(err, client) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "INSERT INTO garage(name, address, picture, total_slot, busy_slot, booking_slot, location_x, location_y, location_z) " +
            "VALUES ('" + name + "', '" + address + "', '" + picture + "', " + total_slot + ", " + busy_slot + ", " + booked_slot +
            ", '" + location_x + "', '" + location_y + "', '" + location_z + "')";
        client.query(sql, function(err) {
            // db.endConnection();
            if(err) {
                return console.error('error running query', err);
            }
            callback({'response': 'Successfully add', 'res': true});
        });
    });
};