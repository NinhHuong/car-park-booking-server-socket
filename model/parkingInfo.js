/**
 * Created by Windows on 21-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'ParkingInfo';

exports.add = function (carID, garageID, timeBooked, callback) {
    console.log("add new " + table_name);
    console.log(carID + ", " + garageID + ", " + timeBooked);

    db.getConnection(function (err, client) {
        if(err)
            db_error.errorDBConnection(err,callback);

        var sql = "SELECT * FROM " + table_name + " WHERE carID = " + carID;
        client.query(sql, function (err, result) {
            if (err) {
                console.error('error running query' + table_name, err);
                return callback({'result': false, 'mess': "db_error "});
            }
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].parkingStatus === 0 || result[i].parkingStatus === 1) {
                        return callback({'result': false, 'mess': "car_busy"});
                    }
                }
            }
            sql = "INSERT INTO " + table_name + " (carID, garageID, timeBooked, parkingStatus)" +
                " VALUES ('" + carID + "', '" + garageID + "', '" + timeBooked + "', " + 0 + ");";
            client.query(sql, function (err) {
                if (err) {
                    console.error('error running query 2:' + table_name, err);
                    return callback({'result': false, 'mess': "db_error"});
                }
                callback({'result': true, 'data': '', 'mess': "book_successfull"});
            });
        });
    });
};

exports.updateByIDTimeGoIn = function (id, timeGoIn, callback) {
    console.log("change " + table_name);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET timeGoIn = '" + timeGoIn + "' , parkingStatus = " + 1 + " WHERE id = " + id;

                // console.log(sql);
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({'result': true, 'data': '', 'mess': "Successfully updated " + table_name});
                });
            } else {
                callback({'result': false, 'data': '', 'mess': "this " + table_name + " was not in Database"});
            }
        });
    });
};

exports.updateByIDTimeGoOut = function (id, timeGoOut, callback) {
    console.log("change " + table_name);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err) return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET timeGoOut = '" + timeGoOut + "' , parkingStatus = " + 2 + " WHERE id = " + id;

                // console.log(sql);
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({'result': true, 'data': '', 'mess': "Successfully updated " + table_name});
                });
            } else {
                callback({'result': false, 'data': '', 'mess': "this " + table_name + " was not in Database"});
            }
        });
    });
};


exports.removeByID = function (id, callback) {
    console.log("remove " + table_name + " id: " + id);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({'result': true, 'data': '', 'mess': "Successfully delete " + table_name});
                });
            } else {
                callback({'result': false, 'data': '', 'mess': "this " + table_name + " was not in database"});
            }
        });
    });
};

exports.findByID = function (ID, callback) {
    console.log("find " + table_name + " ID:" + ID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + ID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record id =" + ID});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};

exports.findByCarID = function (carID, callback) {
    console.log("find " + table_name + " carID:" + carID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE carID = '" + carID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record carID =" + carID});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};

exports.findByAccountID = function (accountID, callback) {
    console.log("find " + table_name + " account ID:" + accountID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT p.*, g.name FROM " + table_name + " p JOIN car c ON p.carID = c.id " +
            "JOIN account a ON c.accountID = a.id JOIN garage g ON g.id = p.garageID WHERE a.id = '" + accountID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record accountID =" + accountID});
            } else {
                callback({'result': true, 'ParkingInfo': result, 'mess': ''});
            }
        });
    });
};

exports.findByGagareID = function (garageID, callback) {
    console.log("find " + table_name + " garageID:" + garageID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE garageID = '" + garageID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record garageID =" + garageID});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};

exports.findByGagareIDAndStatus = function (garageID, status, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + status + "'";
        var sql = "SELECT * FROM " + table_name + " WHERE " + partEndsql;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record " + partEndsql});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};

exports.findByGagareIDStatusAndTime = function (garageID, status, timeStart, timeEnd, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + status
            + "' AND timeBooked BETWEEN  '" + timeStart + "' AND '" + timeEnd + "'";
        var sql = "SELECT * FROM " + table_name + " WHERE " + partEndsql;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record " + partEndsql});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};

exports.findByGagareIDAndTime = function (garageID, typeTime, timeStart, timeEnd, callback) {
    if (!(typeTime === 'timeBooked' || typeTime === 'timeGoIn' || typeTime === 'timeGoOut')) {
        callback({'retult': false, 'data': {'mess': "Dont have any field " + typeTime}})
        return;
    }

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND timeBooked BETWEEN  '" + timeStart + "' AND '" + timeEnd + "'";
        var sql = "SELECT * FROM " + table_name + " WHERE " + partEndsql;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'data': '', 'mess': "Dont have any record " + partEndsql});
            } else {
                callback({'result': true, 'data': result, 'mess': ''});
            }
        });
    });
};


