/**
 * Created by Windows on 15-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'user';

exports.add = function (firstName, lastName, dob, phone, address, callback) {
    console.log("add new " + table_name);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE firstName = '" + firstName + "' AND lastName = '" + lastName + "' AND dateOfBirth = '" + dob +
            "' AND phone = '" + phone + "' AND address = '" + address+"'";
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
                    callback({'result': true, 'mess': "Successfully register new " + table_name});
                });
            } else {
                callback({'result': false, 'mess': "this " + table_name + " was registered"});
            }
        });
    });
};

exports.remove = function (id, callback) {
    console.log("remove " + table_name + " id: " + id);

    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({'result': true, 'mess': "Successfully delete " + table_name});
                });
            } else {
                callback({'result': false, 'mess': "this " + table_name + " was not in database"});
            }
        });
    });
};

exports.findByUserID = function (userID, callback) {
    console.log("find " + table_name + " userID:" + userID);
    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + userID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({'result': false, 'mess': "Dont have any record id =" + userID});
            } else {
                callback({'result': true, 'data': result});
            }
        });
    });
};

exports.updateByID = function (id, newFirstName, newLastName, newdob, newPhone, newAddress, callback) {
    console.log("change " + table_name);

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
                    callback({'result': true, 'mess': "Successfully updated " + table_name});
                });
            } else {
                callback({'result': false, 'mess': "this " + table_name + " was not in Database"});
            }
        });
    });
};


