/**
 * Created by Windows on 15-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'user';

exports.Add = function (firstName, lastName, dob, phone, address, callback) {
    console.log('Add new ' + table_name);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE firstName = '" + firstName + "' AND lastName = '" + lastName +
            "' AND dateOfBirth = '" + dob +
            "' AND phone = '" + phone + "' AND address = '" + address + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query 1:' + table_name, err);
            }

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (firstName, lastName, dateOfBirth, phone, address)" +
                    " VALUES ('" + firstName + "', '" + lastName + "', '" + dob + "', '" + phone + "', '" + address + "');";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query 2:' + table_name, err);
                    }
                    callback({"result": true, "data": "", "mess": "Successfully Register new " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was registered"});
            }
        });
    });
};

exports.AddByAccountId = function (accountId, callback) {
    console.log('>Add new ' + table_name + " by accountID = " + accountId);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = " + accountId;
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query 1:' + table_name, err);
            }

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (accountID)" +
                    " VALUES ('" + accountId + "');";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query 2:' + table_name, err);
                    }
                    callback({"result": true, "data": "", "mess": "Successfully Register new " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was registered"});
            }
        });
    });
};

exports.Remove = function (id, callback) {
    console.log('Remove ' + table_name + ' id: ' + id);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({"result": true, "data": "", "mess": "Successfully delete " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in database"});
            }
        });
    });
};

exports.FindByUserId = function (userID, callback) {
    console.log('find ' + table_name + ' userID:' + userID);
    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + userID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record id =" + userID});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindUserByAccountId = function (accountId, callback) {
    console.log('find ' + table_name + ' accountId:' + accountId);
    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = " + accountId;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "account id = " + accountId + " not found"});
            } else {
                var userID = result[0].id;
                sql = "SELECT * FROM " + table_name + " WHERE id = '" + userID + "'";
                client.query(sql, function (err, result) {

                    if (err)return db_error.errorSQL(sql, callback, err);

                    if (result.length === 0) {
                        callback({"result": false, "data": "", "mess": "userId = " + userID + " not found"});
                    } else {
                        callback({"result": true, "data": result, "mess": ""});

                    }
                });
            }
        });
    });
};

exports.UpdateById = function (id, newFirstName, newLastName, newdob, newPhone, newAddress, callback) {
    console.log('change ' + table_name);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err)return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET firstName = '" + newFirstName + "' , lastName = '" + newLastName + "' , dateOfBirth = '" + newdob +
                    "' , phone = '" + newPhone + "' , address = '" + newAddress + "' WHERE id = " + id;

                // console.log(sql);
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({"result": true, "data": "", "mess": "Successfully updated " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in Database"});
            }
        });
    });
};


