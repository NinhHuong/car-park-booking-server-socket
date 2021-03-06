/**
 * Created by Windows on 15-Jul-17.
 */
var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'role';

exports.Add = function (name, callback) {
    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE name = '" + name + "'";
        console.log(sql);
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (name) VALUES ('" + name + "')";
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({"result": true,"data": "", "mess": "Successfully regist new role"});
                });
            } else {
                callback({"result": false,"data": "", "mess": "this role name was Register"});
            }
        });
    });
};

exports.Remove = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err)  return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err) return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                var id = result[0].id;
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({"result": true,"data": "","mess": "Successfully DELETE " + table_name});
                });
            } else {
                callback({"result": false,"data": "","mess": "this " + table_name + " name was Register"});
            }
        });
    });
};

exports.Edit = function (id, name, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET name = '"+name+"' WHERE id = '" + id + "'";
                console.log(sql);
                client.query(sql, function (err) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    callback({"result": true,"data": "", "mess": "Successfully UPDATE " + table_name});
                });
            } else {
                callback({"result": false,"data": "", "mess": "this " + table_name + " name was Register"});
            }
        });
    });
};


exports.FindById = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";

        client.query(sql, function (err, result) {
            if (err) return db_error.errorSQL(sql, callback, err);

            console.log(result);
            callback({"result": true, "data": result,"mess":""});

        });
    });
};