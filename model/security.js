/**
 * Created by Windows on 16-Jul-17.
 */

var db = require('../database/dbConfig');
const table_name = 'security';

exports.add = function (accountID, garageID, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "' AND garageID = '" + garageID + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (result.length === 0) {
                sql = "INSERT INTO " + table_name + " (accountID,garageID) VALUES (" + accountID + "," + garageID + ")";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully regist new " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " name was register"}});
            }
        });
    });
};

exports.remove = function (accountID, garageID, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "' AND garageID = '" + garageID + "'";
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            if (!(result.length === 0)) {
                var id = result[0].id;
                sql = "DELETE FROM " + table_name + " WHERE id ='" + id + "'";
                client.query(sql, function (err) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    callback({'result': true, 'data': {'mess': "Successfully delete " + table_name}});
                });
            } else {
                callback({'result': false, 'data': {'mess': "this " + table_name + " name was register"}});
            }
        });
    });
};

exports.findByAccountID = function (accountID, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE accountID = '" + accountID + "'";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ticket', err);
            }
            client.query(sql, function (err, result) {
                if (err) {
                    return console.log('error running query garage', err);
                }

                console.log(result);
                callback({'result': true, 'data': result});
            });
        });
    });
};

exports.findByGagareID = function (garageID, callback) {
    db.getConnection(function (err, client) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var sql = "SELECT * FROM " + table_name + " WHERE garageID = '" + garageID + "'";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err) {
                return console.error('error running query ticket', err);
            }
            client.query(sql, function (err, result) {
                if (err) {
                    return console.log('error running query garage', err);
                }

                console.log(result);
                callback({'result': true, 'data': result});
            });
        });
    });
};

exports.updateByID = function (id, newAccountID, newGarageID, callback) {
    console.log("change " + table_name);

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
                sql = "UPDATE " + table_name + " SET accountID = '" + newAccountID + "' , garageID = '" + newGarageID + "' WHERE id = " + id;

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