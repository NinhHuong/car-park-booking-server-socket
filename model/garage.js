/**
 * Created by ninhh on 5/24/2017.
 */
var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
var table_name = 'garage';
//Add
exports.Add = function (name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, statux, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "INSERT INTO garage(name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd,xstatus) " +
            "VALUES ('" + name + "', '" + address + "', " + totalSlot + ", " + busySlot + ", '" +
            locationX + "', '" + locationY + "', '" + accountID + "', '" + timeStart + "', '" + timeEnd + "', '" + statux + "')";

        console.log(sql);
        client.query(sql, function (err) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);
            callback({"result": true, "data": "", "mess": "Successfully Add"});
        });
    });
};

exports.GetRemainSlotsById = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err)return console.error('error fetching client from pool', error);

        var sql = "SELECT * FROM GARAGE WHERE id =" + id;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) {
                console.error('error running query :' + sql, err);
            }
            if (result.length > 0) {
                callback("" + result[0].totalSlot - result[0].busySlot);
            } else {
                console.error('error running query');
            }
        });
    });
};

exports.GetAllGarages = function (callback) {
    db.getConnection(function (err, client) {
        if (err)return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM GARAGE";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);
            client.query(sql, function (err, result) {
                if (err)  return db_error.errorSQL(sql, callback, err);

                console.log("Getting all garages");
                callback({"result": true, "Garages": result, "mess": ""});
            });
        });
    });
};

exports.GetAllGaragesAndAccount = function (callback) {
    db.getConnection(function (err, client) {
        if (err)return db_error.errorDBConnection(err, callback);

        var sql = "SELECT " + table_name + ".*, account.email FROM " + table_name + ", account" +
            " WHERE "+ table_name + ".accountID = account.id";
        client.query(sql, function (err) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);
            client.query(sql, function (err, result) {
                if (err)  return db_error.errorSQL(sql, callback, err);

                console.log("Getting all garages and accounts");
                callback({"result": true, "data": result, "mess": ""});
            });
        });
    });
};

exports.GetGaragesByID = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM GARAGE WHERE id = '" + id + "'";
        if (err) return db_error.errorSQL(sql, callback, err);
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            console.log(result);
            callback({"result": true, "data": result, "mess": ""});
        });
    });
};

exports.GetGaragesByAccountID = function (accountID, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM GARAGE WHERE accountID = '" + accountID + "'";

        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            console.log(result);
            if(result.length ===0)
                callback({"result": false, "data": "", "mess": ""});
            else
            callback({"result": true, "data": result, "mess": ""});
        });
    });
};

exports.UpdateByID = function (id, name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, xstatus, callback) {
    db.getConnection(function (err, client) {
        if (err)return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET name = '" + name + "' , address = '" + address + "' , totalSlot = '"
                    + totalSlot + "' , busySlot = '" + busySlot + "' , locationX = '" + locationX + "' , locationY = '" + locationY
                    + "', accountID = '" + accountID + "' , timeStart = '" + timeStart + "' , timeEnd = '" + timeEnd + "' , xStatus = '" + xstatus + "' WHERE id = " + id;

                console.log(sql);
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


exports.UpdateBusySlotByID = function (id, status, callback) {
    db.getConnection(function (err, client) {
        if (err)return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                if (status === 0) {
                    sql = "UPDATE " + table_name + " SET busySlot = busySlot + 1 WHERE id = '" + id + "'";
                } else if (status === 3) {
                    sql = "UPDATE " + table_name + " SET busySlot = busySlot - 1 WHERE id = '" + id + "'";
                }
                console.log(sql);
                client.query(sql, function (err) {
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    callback({"result": true, "data": {"id": id}, "mess": "Successfully updated " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in Database"});
            }
        });
    });
};


exports.ChangeStatusByID = function (id, busySlot, xstatus, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
                sql = "UPDATE " + table_name + " SET busySlot = '" + busySlot + "', xStatus = '" + xstatus + "' WHERE id = " + id;

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

exports.RemoveByID = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "DELETE FROM " + table_name + " WHERE id = '" + id + "'";
        if (err) return db_error.errorSQL(sql, callback, err);
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            callback({"result": true, "data": "", "mess": "Delete successful."});
        });
    });
};

function GetDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = DegToRad(lat2 - lat1);  // deg2rad below
    var dLon = DegToRad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(DegToRad(lat1)) * Math.cos(DegToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in km
    return R * c;
}

function DegToRad(deg) {
    return deg * (Math.PI / 180)
}
