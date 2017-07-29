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

var constant = require('../other/constant');
console.log("Start server: " + ip.address() + ":5000");

io.sockets.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    console.log('CLIENT CONNECTED: ' + client_ip);

    socket.on('just_for_test', function () {
        console.log('test_emit_func');
    });

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
    socket.on(constant.CONST.REQUEST_EDIT_STATUS_GARAGE_BY_ID, function (id, status) {
        garage.ChangeStatusByID(id, status, function (res) {
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
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_CAR_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_VEHICLE_BY_NUMBER, function (accountID, oldVehicle, newVehicle) {
        car.UpdateByVehicle(accountID, oldVehicle, newVehicle, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_VEHICLE_BY_NUMBER, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_CAR_BY_ID, function (id, accountID) {
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
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_PARKING_INFO, res);
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
            socket.emit(constant.CONST.RESPONSE_EDIT_PARKING_INFO_BY_ID_STATUS, res);
        });
    });

    socket.on(constant.CONST.REQUEST_CAR_GO_IN, function (id) {
        parkingInfo.GetCarWillIn(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_CAR_GO_IN, res);
        });
    });

    socket.on(constant.CONST.REQUEST_CAR_GO_OUT, function (id) {
        parkingInfo.GetCarWillOut(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_CAR_GO_OUT, res);
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
