/**
 * Created by Windows on 21-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'parkinginfo';
var car = require('../model/car');

exports.Add = function (carID, garageID, timeBooked, callback) {
    console.log('Add new ' + table_name);
    console.log(carID + ", " + garageID + ", " + timeBooked);

    db.getConnection(function (err, client) {

        if (err)
            db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE carID = " + carID;
        client.query(sql, function (err, result) {
            if (err) {
                console.error('error running query' + table_name, err);
                return callback({"result": false, "data": "", "mess": "db_error "});
            }
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].parkingStatus === 0 || result[i].parkingStatus === 1) {
                        return callback({'result': false, 'data': '', 'mess': "car_busy"});

                    }
                }
            }
            sql = "INSERT INTO " + table_name + " (carID, garageID, timeBooked, parkingStatus)" +
                " VALUES ('" + carID + "', '" + garageID + "', '" + timeBooked + "', " + 0 + ");";
            client.query(sql, function (err) {
                if (err) {
                    console.error('error running query 2:' + table_name, err);
                    return callback({'result': false, 'data': '', 'mess': "db_error"});
                }
                callback({"result": true, "data": "", "mess": "book_successfull"});
            });
        });
    });
};

exports.UpdateByIdTimeGoIn = function (id, timeGoIn, callback) {
    console.log('change ' + table_name);

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
                    callback({"result": true, "data": "", "mess": "Successfully updated " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in Database"});
            }
        });
    });
};

exports.UpdateByIdAndStatus = function (id, status, callback) {
    console.log('change ' + table_name);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);
            if (result.length > 0) {
                sql = "UPDATE " + table_name + " SET parkingStatus = " + status + " WHERE id = " + id;

                console.log(sql);
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

exports.UpdateByIdTimeGoOut = function (id, timeGoOut, callback) {
    console.log('change ' + table_name);

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
                    callback({"result": true, "data": "", "mess": "Successfully updated " + table_name});
                });
            } else {
                callback({"result": false, "data": "", "mess": "this " + table_name + " was not in Database"});
            }
        });
    });
};

exports.RemoveById = function (id, callback) {
    console.log('Remove ' + table_name + ' id: ' + id);

    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + id + "'";
        client.query(sql, function (err, result) {
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (!(result.length === 0)) {
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

exports.FindById = function (ID, callback) {
    console.log('find ' + table_name + ' ID:' + ID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = '" + ID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record id =" + ID});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindByCarID = function (carID, callback) {
    console.log('find ' + table_name + ' carID:' + carID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var sql = "SELECT * FROM " + table_name + " WHERE carID = '" + carID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record carID =" + carID});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindHistoryByAccountId = function (accountID, callback) {
    console.log('find ' + table_name + ' account ID:' + accountID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT p.*, g.name FROM " + table_name + " p JOIN car c ON p.carID = c.id " +
            "JOIN account a ON c.accountID = a.id JOIN garage g ON g.id = p.garageID WHERE a.id = '" + accountID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record accountID =" + accountID});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindStatusByAccountId = function (accountID, callback) {
    console.log('find ' + table_name + ' account ID:' + accountID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var parkingStatus;

        var sqlBooked = "SELECT p.* " +
            "FROM " + table_name + " p, `car` c " +
            "WHERE p.carID = c.id " +
            "AND p.parkingStatus = 0 " +
            "AND c.accountId = '" + accountID + "'";

        var sqlChecked = "SELECT p.* " +
            "FROM " + table_name + " p, `car` c " +
            "WHERE p.carID = c.id " +
            "AND p.parkingStatus = 1 " +
            "AND c.accountId = '" + accountID + "'";

        client.query(sqlBooked, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sqlBooked, callback, err);

            if (result.length > 0) {
                console.log("ParkingInfo > return > booked result");
                return callback({'result': true, 'data': result[0], 'mess': 'is booking'});
            } else {
                client.query(sqlChecked, function (err, result) {
                    // db.endConnection();
                    if (err) return db_error.errorSQL(sqlChecked, callback, err);

                    if (result.length > 0) {
                        console.log("ParkingInfo > return > checked result");
                        return callback({"result": true, "data": result[0], "mess": "is booking"});
                    }
                });
            }

            return db_error.errorDBConnection(err, callback);
        });
    });
};

exports.FindByGagareId = function (garageID, callback) {
    console.log('find ' + table_name + ' garageID:' + garageID);
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE garageID = '" + garageID + "'";
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record garageID =" + garageID});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindByGagareIdAndStatus = function (garageID, status, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + status + "'";
        var sql = "SELECT * FROM " + table_name + " WHERE " + partEndsql;
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err) return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record " + partEndsql});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.FindByGagareIdStatusAndTime = function (garageID, status, timeStart, timeEnd, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + status
            + "' AND timeBooked BETWEEN  '" + timeStart + "' AND '" + timeEnd + "'";
        var sql = "SELECT * FROM " + table_name + " WHERE " + partEndsql;

        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record " + partEndsql});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.GetCarWillIn = function (garageID, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + 0 + "'";
        var sql = "SELECT parkinginfo.*, vehicleNumber FROM " + table_name +
            " join car ON parkinginfo.carID = car.id WHERE " + partEndsql;

        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record " + partEndsql});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.GetCarWillOut = function (garageID, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + 1 + "'";

        var sql = "SELECT parkinginfo.*, vehicleNumber FROM " + table_name +
            " join car ON parkinginfo.carID = car.id WHERE " + partEndsql;

        console.log("sql:"+sql);
        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record " + partEndsql});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};

exports.CarInId = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;

        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record "});
            } else {
                var d = new Date,
                    timeConvert = [d.getFullYear(),
                            (d.getMonth() + 1).padLeft(),
                            d.getDate().padLeft()].join('/') + ' ' +
                        [d.getHours().padLeft(),
                            d.getMinutes().padLeft(),
                            d.getSeconds().padLeft()].join(':');
                sql = "UPDATE " + table_name + " SET timeGoIn = '" + timeConvert + "' , parkingStatus = " + 1 + " WHERE id = " + id;
                client.query(sql, function (err, result) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    console.log("ID: " + id + " time go in:" + timeConvert);
                    callback({"result": true, "data": "", "mess": "Car out"});
                });
            }
        });
    });
}

exports.CarInVehicleNumber = function (vehicleNumber, garageID, callback) {
    db.getConnection(function (err, client) {
        car.FindByVehicleNumber(vehicleNumber, function (findRes) {
            var result = findRes.result;
            var d = new Date,
                timeConvert = [d.getFullYear(),
                        (d.getMonth() + 1).padLeft(),
                        d.getDate().padLeft()].join('/') + ' ' +
                    [d.getHours().padLeft(),
                        d.getMinutes().padLeft(),
                        d.getSeconds().padLeft()].join(':');
            if (!result) {
                car.AddVehicleNumber(vehicleNumber, function (addRes) {
                    if (addRes.result) {
                        car.FindByVehicleNumber(vehicleNumber, function (findResNext) {
                            var carId = findResNext.data[0].id;

                            sql = "INSERT INTO " + table_name + " (carId, garageID, timeGoIn, parkingStatus) VALUE ('" +
                                carId + "', '" +
                                garageID + "', '" +
                                timeConvert + "', '" +
                                1 + "')";

                            client.query(sql, function (err, result) {
                                // db.endConnection();
                                if (err)  return db_error.errorSQL(sql, callback, err);
                                console.log("Create new parking: carID "+
                                    carId +", garageID "+
                                    garageID+", timeGoIn "+
                                    timeConvert+", status"+1);
                                callback({"result": true, "data": "", "mess": "Car in"});

                            });
                        });
                    }else callback({"result": false, "data": "", "mess": "Fail when add new vehicle"});
                });
            }else {
                var carId = findRes.data[0].id;

                sql = "INSERT INTO " + table_name + " (carId, garageID, timeGoIn, parkingStatus) VALUE ('" +
                    carId + "', '" +
                    garageID + "', '" +
                    timeConvert + "', '" +
                    1 + "')";

                client.query(sql, function (err, result) {
                    // db.endConnection();
                    if (err)  return db_error.errorSQL(sql, callback, err);
                    console.log("Create new parking: carID " +
                        carId + ", garageID " +
                        garageID + ", timeGoIn " +
                        timeConvert + ", status" + 1);
                    callback({"result": true, "data": "", "mess": "Car in"});
                });
            }
        });
    });
   }

exports.CarOut = function (id, callback) {
    db.getConnection(function (err, client) {
        if (err) return db_error.errorDBConnection(err, callback);

        var sql = "SELECT * FROM " + table_name + " WHERE id = " + id;

        client.query(sql, function (err, result) {
            // db.endConnection();
            if (err)  return db_error.errorSQL(sql, callback, err);

            if (result.length === 0) {
                callback({"result": false, "data": "", "mess": "Dont have any record "});
            } else {
                var d = new Date,
                    timeConvert = [d.getFullYear(),
                            (d.getMonth() + 1).padLeft(),
                            d.getDate().padLeft()].join('/') + ' ' +
                        [d.getHours().padLeft(),
                            d.getMinutes().padLeft(),
                            d.getSeconds().padLeft()].join(':');
                sql = "UPDATE " + table_name + " SET timeGoOut = '" + timeConvert + "' , parkingStatus = " + 2 + " WHERE id = " + id;
                client.query(sql, function (err, result) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    console.log("ID: " + id + " timeGoOut:" + timeConvert);
                    callback({"result": true, "data": "", "mess": "Car out"});
                });
            }
        });
    });
}


exports.FindByGagareIdAndTime = function (garageID, typeTime, timeStart, timeEnd, callback) {
    if (!(typeTime === 'timeBooked' || typeTime === 'timeGoIn' || typeTime === 'timeGoOut')) {
        callback({"retult": false, "data": {"mess": "Dont have any field " + typeTime}});
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
                callback({"result": false, "data": "", "mess": "Dont have any record " + partEndsql});
            } else {
                callback({"result": true, "data": result, "mess": ""});
            }
        });
    });
};


