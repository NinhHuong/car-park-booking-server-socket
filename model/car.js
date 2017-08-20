/**
 * Created by Windows on 15-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'car';

exports.Add = function (accountID, vehicleNumber, callback) {
    console.log('Add new ' + table_name + ' vehicleNumber: ' + vehicleNumber + ' accountID: ' + accountID);

    db.getConnection(function (err, client) {
        if (err)
            return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "'";
        client.query(sql, function (err, result) {
            if (err)
                return db_error.errorSQL(sql, callback, err);
            if (result.length >= 5) {
                callback({'result': false, 'data': '', 'mess': "car_limit"});
            } else {
                sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "' AND vehicleNumber = '" + vehicleNumber + "'";
                client.query(sql, function (err, result) {
                    if (err)
                        return db_error.errorSQL(sql, callback, err);

                    if (result.length === 0) {
                        sql = "INSERT INTO " + table_name + " (accountID, vehicleNumber) VALUES ('" + accountID + "', '" + vehicleNumber + "');";
                        client.query(sql, function (err) {
                            if (err)
                                return db_error.errorSQL(sql, callback, err);

                            callback({'result': true, 'data': '', 'mess': "Successfully register new " + table_name,});
                        });
                    } else {
                        callback({'result': false, 'data': '', 'mess': "this " + table_name + " was registered"});
                    }

                });
            }
        });
    });
};

exports.AddBySecurity = function (accountID, vehicleNumber, callback) {
    console.log('Add new ' + table_name + ' vehicleNumber: ' + vehicleNumber + ' accountID: ' + accountID);
    db.getConnection(function (err, client) {
        if (err)
            return db_error.errorDBConnection(err, callback);

        var sql = "INSERT INTO " + table_name + " (accountID, vehicleNumber) VALUES ('" + accountID + "', '" + vehicleNumber + "');";
        client.query(sql, function (err, result) {
            if (err)
                return db_error.errorSQL(sql, callback, err);

            callback({'result': true, 'data': '', 'mess': "Successfully register new " + table_name,});
        });
    });
};

exports.AddVehicleNumber = function (vehicleNumber, callback) {
    console.log('Add new ' + table_name + ' vehicleNumber: ' + vehicleNumber);

    db.getConnection(function (err, client) {
        if (err)
            return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
        client.query(sql, function (err, result) {
            if (err)
                return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (vehicleNumber) VALUES ('" + vehicleNumber + "');";
                client.query(sql, function (err) {
                    if (err)
                        return db_error.errorSQL(sql, callback, err);

                    callback({"result": true, "data": "", "mess": "Successfully Register new " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was registered"});
            }
        });
    });
};

exports.Remove = function (vehicleNumber, callback) {
    console.log('Remove ' + table_name + ' vehicleNumber: ' + vehicleNumber);

    db.getConnection(function (err, client) {
        if (err)
            return db_error.errorDBConnection(err, callback);


        var sql = "SELECT * FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);

                    callback({"result": true, "data": "", "mess": "Successfully delete " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in database"});
            }
        });
    });
};

exports.RemoveByID = function (id, callback) {
    console.log('Remove ' + table_name + ' id: ' + id);
    db.getConnection(function (err, client) {
        if (err)
            return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "DELETE FROM PARKINGINFO WHERE carID = '" + id + "'";
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                });

                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({"result": true, "data": "", "mess": "Successfully delete " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in database"});
            }
        });
    });
};

exports.FindByAccountID = function (accountid, callback) {
    console.log('find ' + table_name + ' accountID:' + accountid);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE accountid = '" + accountid + "'";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);
            client.query(sql, function (err, result) {
                if (err)  return db_error.errorSQL(sql, callback, err);

                if (result.length === 0) {
                    callback({"result": false, "data": "", "mess": "Dont have any car"});
                } else {
                    callback({"result": true, "data": result, "mess": ""});
                }
            });
        });
    });
};

exports.FindByID = function (id, callback) {
    console.log('find ' + table_name + ' ID:' + id);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        // db.endConnection();
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any car"});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });

    });
};

exports.FindByVehicleNumber = function (vehicleNumber, callback) {
    console.log('find ' + table_name + ' vehicleNumber:' + vehicleNumber);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any car"});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindCar = function (accountID, vehicleNumber, callback) {
    console.log('find ' + table_name + ' vehicleNumber:' + vehicleNumber);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE vehicleNumber = '" + vehicleNumber + "' AND accountID = '" + accountID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any car"});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};


exports.UpdateByVehicle = function (accountID, oldVehicle, newVehicle, callback) {
    console.log('change ' + table_name + ' accountID: ' + accountID + ' oldVehicle: ' + oldVehicle + ' newVehicle: ' + newVehicle);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = " + accountID + " AND vehicleNumber = '" + oldVehicle + "'";
        client.query(sql, function (err, result) {
            if (err) return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                var id = result[0].id;

                sql = "UPDATE " + table_name + " SET vehicleNumber = '" + newVehicle + "' WHERE id = '" + id + "'";

                // console.log(sql);
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({"result": true, "data": "", "mess": "Successfully updated " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in Database"});
            }
        });
    });
};

