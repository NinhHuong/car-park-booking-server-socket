/**
 * Created by ninhh on 5/24/2017.
 */
var db = require('../database/dbConfig');
var table_name = 'garage';
//add
exports.add = function (name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd, statux, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "INSERT INTO garage(name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd,xstatus) " +
            "VALUES ('" + name + "', '" + address + "', " + totalSlot + ", " + busySlot + ", '" +
            locationX + "', '" + locationY + "', '" + accountID + "', '" + timeStart + "', '" + timeEnd + "', '" + statux + "')";

        console.log(sql);
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) {
                return console.error('error running query', err);
            }
            callback({'response': 'Successfully add', 'res': true});
        });
    });
};

exports.getAllGarages = function (callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM GARAGE";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ticket', err);
            }
            client.query(sql, function (err, result) {
                if (err) {
                    return console.log('error running query garage', err);
                }

                console.log("Getting all garages");
                callback({'result': true, "Garages": result});
            });
        });
    });
};

exports.getGaragesByID = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM GARAGE WHERE id = '" + id + "'";
        if (err) {
            return console.error('error running query ticket', err);
        }
        client.query(sql, function (err, result) {
            if (err) {
                return console.log('error running query garage', err);
            }

            console.log(result);
            callback({'result': true, "Garage": result});
        });
    });
};

exports.getGaragesByAccountID = function (accountID, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM GARAGE WHERE accountID = '" + accountID + "'";

        client.query(sql, function (err, result) {
            if (err) {
                return console.log('error running query garage', err);
            }

            console.log(result);
            callback({'result': true, "Garage": result});
        });
    });
};

exports.updateByID = function (id, name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd, xstatus, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query' + table_name, err);
            }

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET name = '" + name + "' , address = '" + address + "' , totalSlot = '"
                    + totalSlot + "' , busySlot = '" + busySlot + "' , locationX = '" + locationX + "' , locationY = '" + locationY
                    + "', accountID = '" + accountID + "' , timeStart = '" + timeStart + "' , timeEnd = '" + timeEnd + "' , xStatus = '" + xstatus + "' WHERE id = " + id;

                console.log(sql);
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

exports.changeStatusByID = function (id, xstatus, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query' + table_name, err);
            }

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET xStatus = '" + xstatus + "' WHERE id = " + id;

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
