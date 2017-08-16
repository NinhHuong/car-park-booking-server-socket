var express = require('express');
var router = express.Router();
var ip = require('ip');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.port || 5000);

var account = require('../model/account');
var garage = require('../model/garage');
var car = require('../model/car');
var xuser = require('../model/user');
var parkingInfo = require('../model/parkingInfo');
var security = require('../model/security');
var role = require('../model/role');
var notify = require('../model/notify');

var constant = require('../other/constant');
var admin = require("firebase-admin");

var serviceAccount = require("../carparkingapp-172006-firebase-adminsdk-7zyaw-0bf34bac34.json");

var cancelTimeout;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://carparkingapp-172006.firebaseio.com/"
});

Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

console.log("Start server: " + ip.address() + ":5000");

io.sockets.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    console.log('CLIENT CONNECTED: ' + client_ip);

    socket.on('just_for_test', function () {
        console.log('test_emit_func');
    });

    //region OTHERS
    // exports.NotifyBookingTimeout = function (timeOutStatus) {
    //     console.log("time out status : " + timeOutStatus);
    //     socket.emit(constant.CONST.RESPONSE_NOTI_TIME_OUT, {"result": true, "data": "", "mess": "timeout"});
    // };

    socket.on(constant.CONST.REQUEST_TOKEN_REGISTRATION, function (token) {
        notify.NotifyTest(token);
    });
    //endregion

    //region ACCOUNT
    //Login request
    socket.on(constant.CONST.REQUEST_LOGIN_WITH_EMAIL_AND_PASS, function (email, password) {
        account.Login(email, password, function (res) {
            socket.emit(constant.CONST.RESPONSE_LOGIN_WITH_EMAIL_AND_PASS, res);
        });
    });

    //CheckToken request
    socket.on(constant.CONST.REQUEST_CHECK_TOKEN, function (token) {
        account.CheckToken(token, function (res) {
            socket.emit(constant.CONST.RESPONSE_CHECK_TOKEN, res);
        });
    });

    //Request create new account
    socket.on(constant.CONST.REQUEST_CREATE_NEW_ACCOUNT, function (email, password, roleID) {
        account.Register(email, password, roleID, function (res) {
            socket.emit(constant.CONST.RESPONSE_CREATE_NEW_ACCOUNT, res);
        });
    });

    //reset password
    socket.on(constant.CONST.REQUEST_RESET_PASSWORD, function (email) {
        account.ResetPassInit(email, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_RESET_PASSWORD, res);
        });
    });

    //compare code
    socket.on(constant.CONST.REQUEST_COMPARE_CODE, function (email, code) {
        account.CompareCode(email, code, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_COMPARE_CODE, res);
        });
    });

    //change password
    socket.on(constant.CONST.REQUEST_CHANGE_PASSWORD, function (email, pass) {
        account.ResetPassChange(email, pass, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_CHANGE_PASSWORD, res);
        });
    });

    //create new account for security
    socket.on(constant.CONST.REQUEST_CREATE_ACCOUNT_SECURITY, function (email, pass, accountAdminID) {
        account.RegisterForSecurity(email, pass, accountAdminID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_CREATE_ACCOUNT_SECURITY, res);
        });
    });

    //remote account of security
    socket.on(constant.CONST.REQUEST_REMOVE_SECURITY, function (accountID, garageID) {
        car.FindByAccountID(accountID, function (resultFindCar) {
            if (resultFindCar.result) {
                for (var i = 0; i < resultFindCar.data.length; i++) {
                    car.RemoveByID(resultFindCar.data[i].id, function (resultDeleteCar) {
                        if (resultDeleteCar.result)
                            console.log("Delete car " + resultDeleteCar.data[i].id + " success");
                        else console.log("Delete car " + resultDeleteCar.data[i].id + " fail");
                    })
                }
                security.Remove(accountID, garageID, function (res) {
                    if (res.result)
                        console.log("Remove account in security table");
                    else
                        console.log("Remove account in security table fail");
                });

                account.RemoveAccountByID(accountID, function (resultDeleteAccount) {
                    console.log("Remove account in account table");
                    socket.emit(constant.CONST.RESPONSE_REMOVE_SECURITY, resultDeleteAccount);
                })
            } else
                console.log("Dont have car or error");
        });


    });

    //get accountID by Email
    socket.on(constant.CONST.REQUEST_GET_ACCOUNT_ID_BY_EMAIL, function (email) {
        account.GetAccountIDByEmail(email, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_GET_ACCOUNT_ID_BY_EMAIL, res);
        });
    });
    //endregion

    //region GARAGES
    //ADD NEW GARAGE
    socket.on(constant.CONST.REQUEST_ADD_NEW_GARAGE, function (name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, statux) {
        garage.Add(name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, statux, function (res) {
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_GARAGE, res);
        })
    });

    //GET ALL GARAGE
    socket.on(constant.CONST.REQUEST_GET_ALL_GARAGES, function () {
        garage.GetAllGarages(function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_ALL_GARAGE, res);
        })
    });

    //GET GARAGE FOLLOW GARAGE ID
    socket.on(constant.CONST.REQUEST_GET_GARAGE_BY_ID, function (id) {
        garage.GetGaragesByID(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_GARAGE_BY_ID, res);
        })
    });

    //GET GARAGE FOLLOW ADMIN ID
    socket.on(constant.CONST.REQUEST_GET_GARAGE_BY_ACCOUNT_ID, function (id) {
        garage.GetGaragesByAccountID(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_GARAGE_BY_ACCOUNT_ID, res);
        })
    });

    //EDIT STATUS OF GARAGE BY GARAGE ID
    socket.on(constant.CONST.REQUEST_EDIT_STATUS_GARAGE_BY_ID, function (id, busySlot, status) {
        garage.ChangeStatusByID(id, busySlot, status, function (res) {
            socket.emit(constant.CONST.RESPONSE_EDIT_STATUS_GARAGE_BY_ID, res);
        })
    });

    //EDIT GARAGE BY GARAGE ID
    socket.on(constant.CONST.REQUEST_EDIT_GARAGE_BY_ID, function (id, name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, xstatus) {
        garage.UpdateByID(id, name, address, totalSlot, busySlot, locationX, locationY, accountID, timeStart, timeEnd, xstatus, function (res) {
            socket.emit(constant.CONST.RESPONSE_EDIT_GARAGE_BY_ID, res);
        })
    });

    //endregion

    //region CAR
    socket.on(constant.CONST.REQUEST_ADD_NEW_CAR, function (accountID, vehicleNumber) {
        car.Add(accountID, vehicleNumber, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_CAR, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_CAR, function (vehicleNumber) {
        car.Remove(vehicleNumber, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_CAR, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_CAR_BY_ACCOUNT_ID, function (accountID) {
        car.FindByAccountID(accountID, function (res) {
            // console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_CAR_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_CAR_BY_ID, function (carID) {
        car.FindByID(carID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_CAR_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_VEHICLE_BY_NUMBER, function (accountID, oldVehicle, newVehicle) {
        car.UpdateByVehicle(accountID, oldVehicle, newVehicle, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_VEHICLE_BY_NUMBER, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_CAR_BY_ID, function (id) {
        car.RemoveByID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_CAR_BY_ID, res);
        });
    });
    //endregion

    //region USER
    socket.on(constant.CONST.REQUEST_ADD_NEW_USER, function (firstName, lastName, dob, phone, address) {
        xuser.Add(firstName, lastName, dob, phone, address, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_USER, res);
        });
    });

    socket.on(constant.CONST.REQUEST_ADD_NEW_USER_BY_ACCOUNT_ID, function (accountId) {
        xuser.AddByAccountId(accountId, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_USER_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_USER_BY_ID, function (id) {
        xuser.Remove(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_USER_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_USER_BY_ID, function (id) {
        xuser.FindByUserId(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_USER_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_USER_BY_ACCOUNT_ID, function (accountId) {
        xuser.FindUserByAccountId(accountId, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_USER_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_USER_BY_ID, function (id, firstName, lastName, dob, phone, address) {
        xuser.UpdateById(id, firstName, lastName, dob, phone, address, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_USER_BY_ID, res);
        });
    });
    //endregion

    //region PARKING INFO
    socket.on(constant.CONST.REQUEST_ADD_NEW_PARKING_INFO, function (carID, garageID, timeBooked) {
        parkingInfo.Add(carID, garageID, timeBooked, function (res) {
            console.log(res);
            if (res.result) {

            }
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_PARKING_INFO, res);
        });
    });

    socket.on(constant.CONST.REQUEST_ADD_NEW_PARKING_INFO_BY_USER, function (carID, garageID, timeBooked, notifyToken) {
        parkingInfo.AddByUser(carID, garageID, timeBooked, notifyToken, function (res) {
            console.log(res);
            if (res.result) {
                //Update garage busy slots
                garage.UpdateBusySlotByID(garageID, 0, function (garageRes) {
                    if (garageRes.result) {
                        garage.GetGaragesByID(garageID, function (getGarageRes) {
                            if (getGarageRes.result) {
                                console.log("> Update garage detail for all clients");
                                io.sockets.emit(constant.CONST.RESPONSE_GARAGE_UPDATED,
                                    getGarageRes);
                            }
                        });
                    }
                });
                notify.StartBookingTimeout(constant.CONST.NOTIFY_BOOKING_TIMEOUT,
                    constant.CONST.CANCEL_BOOKING_TIMEOUT, notifyToken);
                if (cancelTimeout !== null) {
                    clearTimeout(cancelTimeout);
                }
                cancelTimeout = setTimeout(function () {
                    parkingInfo.CancelByCarIdAndGarageId(carID, garageID, function (cancelRes) {
                        if (cancelRes.result) {
                            socket.emit(constant.CONST.RESPONSE_BOOKING_CANCELED,
                                {"result": true, "data": "", "mess": "booking_canceled"});

                            //Update garage busy slots
                            garage.UpdateBusySlotByID(garageID, 3, function (garageRes) {
                                if (garageRes.result) {
                                    garage.GetGaragesByID(garageID, function (getGarageRes) {
                                        if (getGarageRes.result) {
                                            console.log("> Update garage detail for all clients");
                                            io.sockets.emit(constant.CONST.RESPONSE_GARAGE_UPDATED,
                                                getGarageRes);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }, constant.CONST.CANCEL_BOOKING_TIMEOUT);

            }
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_PARKING_INFO_BY_USER, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_PARKING_INFO_BY_ID, function (id) {
        parkingInfo.RemoveById(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_PARKING_INFO_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_PARKING_INFO_BY_ID, function (id) {
        parkingInfo.FindById(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_PARKING_INFO_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_PARKING_INFO_BY_CAR_ID, function (id) {
        parkingInfo.FindByCarID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_PARKING_INFO_BY_CAR_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_PARKING_INFO_BY_GARAGE_ID, function (id) {
        parkingInfo.FindByGagareId(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_PARKING_INFO_BY_GARAGE_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_PARKING_INFO_TIME_GO_IN_BY_ID, function (id, timeGoIn) {
        parkingInfo.UpdateByIdTimeGoIn(id, timeGoIn, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_PARKING_INFO_TIME_GO_IN_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_PARKING_INFO_TIME_GO_OUT_BY_ID, function (id, timeGoOut) {
        parkingInfo.UpdateByIdTimeGoOut(id, timeGoOut, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_PARKING_INFO_TIME_GO_OUT_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_PARKING_INFO_HISTORY_BY_ACCOUNT_ID, function (accountID) {
        parkingInfo.FindHistoryByAccountId(accountID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_PARKING_INFO_HISTORY_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_PARKING_INFO_BY_ACCOUNT_ID, function (accountID) {
        parkingInfo.FindStatusByAccountId(accountID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_PARKING_INFO_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_PARKING_INFO_BY_ID_STATUS, function (id, parkingStatus) {
        parkingInfo.UpdateByIdAndStatus(id, parkingStatus, function (res) {
            console.log(res);
            if (res.result && parkingStatus === 3) {
                //Cancel status
                //Update garage busy slot
                notify.StopBookingTimeout();
                garage.UpdateBusySlotByID(res.data[0].garageID, parkingStatus, function (garageRes) {
                    if (garageRes.result) {
                        garage.GetGaragesByID(res.data[0].garageID, function (getGarageRes) {
                            if (getGarageRes.result) {
                                console.log("> Update garage detail for all clients");
                                io.sockets.emit(constant.CONST.RESPONSE_GARAGE_UPDATED,
                                    getGarageRes);
                            }
                        });
                    }
                });
            }
            socket.emit(constant.CONST.RESPONSE_EDIT_PARKING_INFO_BY_ID_STATUS, res);
        });
    });

    // get all were was booked
    socket.on(constant.CONST.REQUEST_CAR_GO_IN, function (id) {
        parkingInfo.GetCarWillIn(id, function (res) {
            console.log("Get car will go out in garage with id:" + id);
            socket.emit(constant.CONST.RESPONSE_CAR_GO_IN, res);
        });
    });

    // get all car were in garage
    socket.on(constant.CONST.REQUEST_CAR_GO_OUT, function (id) {
        parkingInfo.GetCarWillOut(id, function (res) {
            console.log("Get car will go out out garage with id:" + id);
            socket.emit(constant.CONST.RESPONSE_CAR_GO_OUT, res);
        });
    });

    // change data. one car booked to go in
    socket.on(constant.CONST.REQUEST_CAR_IN_ID, function (id, garageID) {
        parkingInfo.CarInId(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_CAR_IN, res);

            if (res.result) {
                console.log("parking info id " + id + " is in");
                var request = ({"result": true, "data": ({"garageID": garageID}), "mess": "Car out"});
                garage.UpdateBusySlotByID(garageID, 0, function (resultUpdateGarage) {
                    if (resultUpdateGarage.result)
                        console.log("Increase busy slot in garage garageID" + garageID);
                    else
                        console.log("Error increase busy slot in garage garageID" + garageID);
                });
                io.emit(constant.CONST.REQUEST_REFRESH_SECURITY_PARKING_LIST, request);
            } else
                console.log("Error car in id:" + id);

        });
    });

    // Create new data. one car was not book go in
    socket.on(constant.CONST.REQUEST_CAR_IN_NUMBER, function (vehicleNumber, garageID) {
        parkingInfo.CarInVehicleNumber(vehicleNumber, garageID, function (res) {
            socket.emit(constant.CONST.RESPONSE_CAR_IN, res);

            if (res.result) {
                console.log("parking info vehicleNumber " + vehicleNumber + " is in");
                var request = ({"result": true, "data": ({"garageID": garageID}), "mess": "Car out"});
                io.emit(constant.CONST.REQUEST_REFRESH_SECURITY_PARKING_LIST, request);

                garage.UpdateBusySlotByID(garageID, 0, function (resultUpdateGarage) {
                    if (resultUpdateGarage.result)
                        console.log("Increase busy slot in garage garageID" + garageID);
                    else
                        console.log("Error increase busy slot in garage garageID" + garageID);
                });
            }else
                console.log("Error car in number:" + vehicleNumber);

        });
    });

    // change data. one car go in  to go out
    socket.on(constant.CONST.REQUEST_CAR_OUT, function (id, garageID) {
        parkingInfo.CarOut(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_CAR_OUT, res);

            if (res.result) {
                console.log("parking info id " + id + " is out");
                var request = ({"result": true, "data": ({"garageID": garageID}), "mess": "Car out"});
                io.emit(constant.CONST.REQUEST_REFRESH_SECURITY_PARKING_LIST, request);
                garage.UpdateBusySlotByID(garageID, 3, function (resultUpdateGarage) {
                    if (resultUpdateGarage.result)
                        console.log("Decrease busy slot in garage garageID" + garageID);
                    else
                        console.log("Error decrease busy slot in garage garageID" + garageID);
                });
            }
            else
                console.log("Error car out id:" + id);

        });
    });

    socket.on(constant.CONST.REQUEST_REFRESH_BOOKING_TIMEOUT, function (id, notifyToken) {
        parkingInfo.FindById(id, function (res) {
            console.log(res);
            var refreshResponse;
            if (res.result && res.data[0].parkingStatus === 0) {
                notify.StartBookingTimeout(constant.CONST.NOTIFY_BOOKING_TIMEOUT,
                    constant.CONST.CANCEL_BOOKING_TIMEOUT, notifyToken);
                console.log("cancel Timeout: " + cancelTimeout);
                clearTimeout(cancelTimeout);
                cancelTimeout = setTimeout(function () {
                    parkingInfo.CancelByCarIdAndGarageId(res.data[0].carID, res.data[0].garageID, function (cancelRes) {
                        console.log("> Cacnel response: " + cancelRes.result);
                        if (cancelRes.result) {
                            socket.emit(constant.CONST.RESPONSE_BOOKING_CANCELED,
                                {"result": true, "data": "", "mess": "booking_canceled"});
                            //Update garage busy slots
                            garage.UpdateBusySlotByID(res.data[0].garageID, 3, function (garageRes) {
                                if (garageRes.result) {
                                    garage.GetGaragesByID(res.data[0].garageID, function (getGarageRes) {
                                        if (getGarageRes.result) {
                                            console.log("> Update garage detail for all clients");
                                            io.sockets.emit(constant.CONST.RESPONSE_GARAGE_UPDATED,
                                                getGarageRes);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }, constant.CONST.CANCEL_BOOKING_TIMEOUT);
                refreshResponse = {"result": true, "data": "", "mess": "refresh_success"};
            } else {
                refreshResponse = {"result": false, "data": "", "mess": "refresh_failed"};
            }
            console.log("Response: " + refreshResponse);
            socket.emit(constant.CONST.RESPONSE_REFRESH_BOOKING_TIMEOUT, refreshResponse);
        });
    });

    socket.on(constant.CONST.REQUEST_HISTORY, function (garageID) {
        parkingInfo.FindByGagareIdAndStatus(garageID, 2, function (res) {
            console.log("Admin request history");
            socket.emit(constant.CONST.RESPONSE_HISTORY, res);
        });
    });


    //endregion

    //region SECURITY
    socket.on(constant.CONST.REQUEST_ADD_NEW_SECURITY, function (accountID, garageID) {
        security.Add(accountID, garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_SECURITY, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_SECURITY, function (accountID, garageID) {
        security.Remove(accountID, garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_SECURITY, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_SECURITY_BY_ACCOUNT_ID, function (accountID) {
        security.FindByAccountId(accountID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_SECURITY_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_SECURITY_BY_GARAGE_ID, function (garageID) {
        security.FindByGagareId(garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_SECURITY_BY_GARAGE_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_SECURITY_BY_ID, function (id, newAccountID, newGarageID) {
        security.UpdateById(id, newAccountID, newGarageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_SECURITY_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_ALL_SECURITY, function (garageID) {
        security.FindAllAccountSecurity(garageID, function (res) {
            console.log("Get all sec of garage id:" + garageID);
            socket.emit(constant.CONST.RESPONSE_ALL_SECURITY, res);
        });
    });

    //endregion

    //region ROLE
    socket.on(constant.CONST.REQUEST_ADD_NEW_ROLE, function (name) {
        role.Add(name, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_ROLE, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_ROLE_BY_ID, function (id) {
        role.FindById(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_ROLE_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_ROLE_BY_ID, function (id, name) {
        role.Edit(id, name, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_ROLE_BY_GARAGE_ID, res);
        });
    });


    //endregion

    socket.on('disconnect', function () {
        console.log('CLIENT DISCONNECT: ' + client_ip);
    });
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
