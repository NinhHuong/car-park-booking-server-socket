/**
 * Created by Windows on 15-Jul-17.
 */

var db = require('../database/dbConfig');
const table_name = 'booking';

exports.add = function (carID, garageID, timeBooked, callback) {
    console.log("add new " + table_name);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        sql = "INSERT INTO " + table_name + " (carID, garageID, timeBooked, bookStatus)" +
            " VALUES ('" + carID + "', '" + garageID + "', '" + timeBooked + "', " + 0 + ");";
        client.query(sql, function (err) {
            if (err) {
                return console.error('error running query 2:' + table_name, err);
            }
            callback({'result': true, 'data': {'mess': "Successfully register new " + table_name}});
        });

    });
};

exports.updateByIDTimeGoIn = function (id, timeGoIn, callback) {
    console.log("change " + table_name);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query' + table_name, err);
            }

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET timeGoIn = '" + timeGoIn + "' , bookStatus = " + 1 + " WHERE id = " + id;

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

exports.updateByIDTimeGoOut = function (id, timeGoOut, callback) {
    console.log("change " + table_name);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query' + table_name, err);
            }

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET timeGoOut = '" + timeGoOut + "' , bookStatus = " + 2 + " WHERE id = " + id;

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


exports.removeByID = function (id, callback) {
    console.log("remove " + table_name + " id: " + id);

    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query remove', err);
            }

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
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

exports.findByID = function (ID, callback) {
    console.log("find " + table_name + " ID:" + ID);
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + ID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ' + table_name, err);
            }

            if (result.length === 0) {
                callback({'result': false, 'data': {'mess': "Dont have any record id =" + ID}});
            } else {
                callback({'result': true, 'data': result});
            }
        });
    });
};

exports.findByCarID = function (carID, callback) {
    console.log("find " + table_name + " carID:" + carID);
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE carID = '" + carID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ' + table_name, err);
            }

            if (result.length === 0) {
                callback({'result': false, 'data': {'mess': "Dont have any record carID =" + carID}});
            } else {
                callback({'result': true, 'data': result});
            }
        });
    });
};

exports.findByGagareID = function (garageID, callback) {
    console.log("find " + table_name + " garageID:" + garageID);
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE garageID = '" + garageID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ' + table_name, err);
            }

            if (result.length === 0) {
                callback({'result': false, 'data': {'mess': "Dont have any record garageID =" + garageID}});
            } else {
                callback({'result': true, 'data': result});
            }
        });
    });
};


