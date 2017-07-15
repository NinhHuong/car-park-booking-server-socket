/**
 * Created by Windows on 15-Jul-17.
 */

var db = require('../database/dbConfig');
const table_name = 'car';

exports.add = function (accountID, vehicleNumber, callback) {
    console.log("add new " + table_name + " vehicleNumber: " + vehicleNumber + " accountID: " + accountID);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "' AND vehicleNumber = '" + vehicleNumber + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query 1:' + table_name, err);
            }

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (accountID, vehicleNumber) VALUES ('" + accountID + "', '" + vehicleNumber + "');";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query 2:' + table_name, err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully register new " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " was registered"}});
            }
        });
    });
};

exports.remove = function (vehicleNumber, callback) {
    console.log("remove " + table_name + " vehicleNumber: " + vehicleNumber);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query remove', err);
            }

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query' + table_name, err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully delete " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " was not in database"}});
            }
        });
    });
};

exports.findByAccountID = function (accountid, callback) {
    console.log("find " + table_name + " accountID:" + accountid);
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE accountid = '" + accountid + "'";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ' + table_name, err);
            }
            client.query(sql, function (err, result) {
                if (err) {
                    return console.log('error running query ' + table_name, err);
                }

                if (result.length === 0){
                        callback({'result': false, 'data': {'mess': "Dont have any car"}});
                } else {
                    callback({'result': true, 'data': result});
                }
            });
        });
    });
};

exports.updateByVehicle = function (accountID, oldVehicle, newVehicle, callback) {
    console.log("change " + table_name + " accountID: " + accountID + " oldVehicle: " + oldVehicle + " newVehicle: " + newVehicle);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = " + accountID + " AND vehicleNumber = '" + oldVehicle + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query' + table_name, err);
            }

            if (!(result.length === 0)) {
                var id = result[0].id;

                sql = "UPDATE " + table_name + " SET vehicleNumber = '" + newVehicle + "' WHERE id = '"+id+"'";

                // console.log(sql);
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query' + table_name, err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully updated " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " was not in Database"}});
            }
        });
    });
};

