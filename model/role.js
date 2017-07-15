/**
 * Created by Windows on 15-Jul-17.
 */
var db = require('../database/dbConfig');
const table_name = 'role';

exports.add = function (name, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE name = '" + name + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (name) VALUES (" + name + ")";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully regist new role"}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this role name was register"}});
            }
        });
    });
};

exports.remove = function (name, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " name = '" + name + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (!(result.length === 0)) {
                var id = result[0].id;
                sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully DELETE " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " name was register"}});
            }
        });
    });
};

exports.findByID = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";

        client.query(sql, function (err, result) {
            if (err) {
                return console.log('error running query garage' + table_name, err);
            }

            console.log(result);
            callback({'result': true, 'data': result});

        });
    });
};