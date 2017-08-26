/**
 * Created by Windows on 21-Jul-17.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
const table_name = 'parkinginfo';
var car = require('../model/car');
var garage = require('../model/garage');
var notify = require('../model/notify');

var cancelBookingTimeout = 20 * 1000;
var notifyBookingTimeout = 10 * 1000;

var cancelTimeout;

exports.Add = function (carID, garageID, timeBooked, callback) {
    console.log('Add new ' + table_name);
    console.log(carID + ", " + garageID + ", " + timeBooked);

    db.getConnection(function (err, client) {

        if (err)
            db_error.errorDBConnection(err, callback);

        var remainSlot = 0;
        garage.GetRemainSlotsById(garageID, function (res) {
            console.log(res);
            remainSlot = res;

            if (remainSlot === 0) {
                callback({'result': false, 'data': '', 'mess': "out_of_slots"});
            } else {
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
                            callback({'result': false, 'data': '', 'mess': "db_error"});
                        }
                        callback({"result": true, "data": "", "mess": "book_successfull"});
                    });
                });
            }
        });
    });
};

exports.AddByUser = function (carID, garageID, timeBooked, notifyToken, callback) {
    console.log('Add new ' + table_name);
    console.log(carID + ", " + garageID + ", " + timeBooked);

    db.getConnection(function (err, client) {

        if (err)
            db_error.errorDBConnection(err, callback);

        var remainSlot = 0;
        garage.GetRemainSlotsById(garageID, function (res) {
            console.log(res);
            remainSlot = res;

            if (remainSlot === 0) {
                callback({'result': false, 'data': '', 'mess': "out_of_slots"});
            } else {
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
                            callback({'result': false, 'data': '', 'mess': "db_error"});
                        }
                        callback({"result": true, "data": "", "mess": "book_successfull"});
                    });
                });
            }
        });
    });
};

exports.CancelByCarIdAndGarageId = function (carID, garageID, callback) {
    db.getConnection(function (err, client) {
        console.log('CancelByCarIdAndGarageId is running')
        var sql =
            "SELECT * FROM " + table_name + " " +
            "WHERE carID = " + carID + " AND garageID = " + garageID + " AND parkingStatus = " + 0;
        client.query(sql, function (err, result) {
            if (err) {
                console.error('error running CancelByCarIdAndGarageId:' + table_name, err);
            }
            if (result.length > 0) {
                var id = result[0].id;
                exports.UpdateByIdAndStatus(id, 3, function (res) {
                    if (res.result) {
                        console.log('CancelByCarIdAndGarageId query success')
                        callback({"result": true, "data": "", "mess": "cancel_booking_success"})
                    }
                });
            } else {
                callback({"result": false, "data": "", "mess": "no_booking"})
            }
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
                    callback({"result": true, "data": result, "mess": "Successfully updated " + table_name});
                    console.log("UpdateByIdAndStatus success")
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
                console.log("get history success")
                callback({'result': true, 'data': result, 'mess': ''});

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
            "AND c.accountId = '" + accountID + "'" +
            "ORDER BY p.timeBooked DESC";

        var sqlChecked = "SELECT p.* " +
            "FROM " + table_name + " p, `car` c " +
            "WHERE p.carID = c.id " +
            "AND p.parkingStatus = 1 " +
            "AND c.accountId = '" + accountID + "'" +
            "ORDER BY p.timeBooked DESC";

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
                        return callback({"result": true, "data": result[0], "mess": "is checked"});
                    }
                    else {
                        return callback({'result': false, 'data': '', 'mess': 'no booking'});
                    }
                });
            }
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
        var partEndsql = "garageID = '" + garageID + "' AND parkingStatus = '" + status + "' ORDER BY DATE(timeBooked)";
        var sql = "SELECT parkinginfo.*, vehicleNumber FROM " + table_name +
            " join car ON parkinginfo.carID = car.id WHERE " + partEndsql;
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
                sql = "UPDATE " + table_name + " SET timeGoIn = NOW() , parkingStatus = " + 1 + " WHERE id = " + id;
                client.query(sql, function (err, result) {
                    if (err) return db_error.errorSQL(sql, callback, err);
                    console.log("ID: " + id + " time go in:" + timeConvert);
                    callback({"result": true, "data": "", "mess": "Car out"});
                });
            }
        });
    });
}

exports.CarInVehicleNumber = function (vehicleNumber,securityID, garageID, callback) {
    db.getConnection(function (err, client) {
        car.FindCar(securityID,vehicleNumber, function (findRes) {
            var result = findRes.result;
            var d = new Date,
                timeConvert = [d.getFullYear(),
                        (d.getMonth() + 1).padLeft(),
                        d.getDate().padLeft()].join('/') + ' ' +
                    [d.getHours().padLeft(),
                        d.getMinutes().padLeft(),
                        d.getSeconds().padLeft()].join(':');
            if (!result) {
                car.AddBySecurity(securityID,vehicleNumber, function (addRes) {
                    if (addRes.result) {
                        car.FindCar(securityID,vehicleNumber, function (findResNext) {
                            var carId = findResNext.data[0].id;

                            sql = "INSERT INTO " + table_name + " (carId, garageID, timeGoIn, parkingStatus) VALUE ('" +
                                carId + "', '" +
                                garageID + "'," +
                                " NOW(), '" +
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
                        });
                    } else callback({"result": false, "data": "", "mess": "Fail when add new vehicle"});
                });
            } else {
                var carId = findRes.data[0].id;

                sql = "INSERT INTO " + table_name + " (carId, garageID, timeGoIn, parkingStatus) VALUE ('" +
                    carId + "', '" +
                    garageID + "', '"  +
                    " NOW(), '" +
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
                sql = "UPDATE " + table_name + " SET timeGoOut = NOW() , parkingStatus = " + 2 + " WHERE id = " + id;
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
