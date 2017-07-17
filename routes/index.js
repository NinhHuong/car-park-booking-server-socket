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
var booking = require('../model/booking');
var security = require('../model/security');
var role = require('../model/role');

var constant = require('../other/constant');
console.log("Start server: "+ ip.address()+":5000");

io.sockets.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    console.log('CLIENT CONNECTED: ' + client_ip);

    socket.on('just_for_test', function (account_detail) {
        console.log('test_emit_func');
    });

    //region ACCOUNT
    //Login request
    socket.on(constant.CONST.REQUEST_LOGIN_WITH_EMAIL_AND_PASS, function (account_detail) {
        var json = JSON.parse(account_detail);
        account.login(json["email"], json["password"], function (res) {
            socket.emit(constant.CONST.RESPONSE_LOGIN_WITH_EMAIL_AND_PASS, res);
        });
    });

    //Request salt string
    socket.on(constant.CONST.REQUEST_GET_SALT, function (email) {
        account.login_request(email, function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_SALT, res);
        });
    });

    //Request create new account
    socket.on(constant.CONST.REQUEST_CREATE_NEW_ACCOUNT, function (rigister_detail) {
        var json = JSON.parse(rigister_detail);
        account.register(json["email"], json["password"], json["salt"], json["roleID"], function (res) {
            socket.emit(constant.CONST.RESPONSE_CREATE_NEW_ACCOUNT, res);
        });
    });

    //reset password
    socket.on(constant.CONST.REQUEST_RESET_PASSWORD, function (email) {
        account.reset_pass_init(email, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_RESET_PASSWORD, res);
        });
    });

    socket.on(constant.CONST.REQUEST_CHANGE_PASSWORD, function (email, code, npass) {
        account.reset_pass_change(email, code, npass, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_CHANGE_PASSWORD, res);
        });
    });
    //endregion

    //region GARAGES
    socket.on(constant.CONST.REQUEST_ADD_NEW_GARAGE, function (name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd, statux) {
        garage.add(name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd, statux, function (res) {
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_GARAGE, res);
        })
    });

    socket.on(constant.CONST.REQUEST_GET_ALL_GARAGES, function () {
        garage.getAllGarages(function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_ALL_GARAGE, res);
        })
    });

    socket.on(constant.CONST.REQUEST_GET_GARAGE_BY_ID, function (id) {
        garage.getGaragesByID(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_GARAGE_BY_ID, res);
        })
    });

    socket.on(constant.CONST.REQUEST_GET_GARAGE_BY_ACCOUNT_ID, function (id) {
        garage.getGaragesByAccountID(id, function (res) {
            socket.emit(constant.CONST.RESPONSE_GET_GARAGE_BY_ACCOUNT_ID, res);
        })
    });

    socket.on(constant.CONST.REQUEST_EDIT_STATUS_GARAGE_BY_ID, function (id,status) {
        garage.changeStatusByID(id,status, function (res) {
            socket.emit(constant.CONST.RESPONSE_EDIT_STATUS_GARAGE_BY_ID, res);
        })
    });


    socket.on(constant.CONST.REQUEST_EDIT_GARAGE_BY_ID, function (id, name, address, totalSlot, busySlot, locationX, locationY, accountID,timeStart, timeEnd, xstatus) {
        garage.updateByID(id, name, address, totalSlot, busySlot, locationX, locationY,accountID, timeStart, timeEnd, xstatus, function (res) {
            socket.emit(constant.CONST.RESPONSE_EDIT_GARAGE_BY_ID, res);
        })
    });

    //endregion

    //region CAR
    socket.on(constant.CONST.REQUEST_ADD_NEW_CAR, function (accountID, vehicleNumber) {
        car.add(accountID, vehicleNumber, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_CAR, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_CAR, function (vehicleNumber) {
        car.remove(vehicleNumber, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_CAR, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_CAR_BY_ACCOUNT_ID, function (accountID) {
        car.findByAccountID(accountID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_CAR_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_VEHICLE_BY_NUMBER, function (accountID, oldVehicle, newVehicle) {
        car.updateByVehicle(accountID, oldVehicle, newVehicle, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_VEHICLE_BY_NUMBER, res);
        });
    });
    //endregion

    //region USER
    socket.on(constant.CONST.REQUEST_ADD_NEW_USER, function (firstName, lastName, dob, phone, address) {
        xuser.add(firstName, lastName, dob, phone, address, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_USER, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_USER_BY_ID, function (id) {
        xuser.remove(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_USER_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_USER_BY_ID, function (id) {
        xuser.findByUserID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_USER_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_USER_BY_ID, function (id, firstName, lastName, dob, phone, address) {
        xuser.updateByID(id, firstName, lastName, dob, phone, address, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_USER_BY_ID, res);
        });
    });
    //endregion

    //region BOOKING
    socket.on(constant.CONST.REQUEST_ADD_NEW_BOOKING, function (carID, garageID, timeBooked) {
        booking.add(carID, garageID, timeBooked, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_BOOKING, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_BOOKING_BY_ID, function (id) {
        booking.removeByID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_BOOKING_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_BOOKING_BY_ID, function (id) {
        booking.findByID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_BOOKING_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_BOOKING_BY_CAR_ID, function (id) {
        booking.findByCarID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_BOOKING_BY_CAR_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_BOOKING_BY_GARAGE_ID, function (id) {
        booking.findByGagareID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_BOOKING_BY_GARAGE_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_BOOKING_TIME_GO_IN_BY_ID, function (id, timeGoIn) {
        booking.updateByIDTimeGoIn(id, timeGoIn, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_BOOKING_TIME_GO_IN_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_BOOKING_TIME_GO_OUT_BY_ID, function (id, timeGoOut) {
        booking.updateByIDTimeGoOut(id, timeGoOut, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_BOOKING_TIME_GO_OUT_BY_ID, res);
        });
    });
    //endregion

    //region SECURITY
    socket.on(constant.CONST.REQUEST_ADD_NEW_SECURITY, function (accountID, garageID) {
        security.add(accountID, garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_SECURITY, res);
        });
    });

    socket.on(constant.CONST.REQUEST_REMOVE_SECURITY, function (accountID, garageID) {
        security.remove(accountID, garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_REMOVE_SECURITY, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_SECURITY_BY_ACCOUNT_ID, function (accountID) {
        security.findByAccountID(accountID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_SECURITY_BY_ACCOUNT_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_SECURITY_BY_GARAGE_ID, function (garageID) {
        security.findByGagareID(garageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_SECURITY_BY_GARAGE_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_SECURITY_BY_ID, function (id, newAccountID, newGarageID) {
        security.updateByID(id, newAccountID, newGarageID, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_EDIT_SECURITY_BY_ID, res);
        });
    });

    //endregion

    //region ROLE
    socket.on(constant.CONST.REQUEST_ADD_NEW_ROLE, function ( name) {
        role.add( name, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_ADD_NEW_ROLE, res);
        });
    });

    socket.on(constant.CONST.REQUEST_FIND_ROLE_BY_ID, function (id) {
        role.findByID(id, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_ROLE_BY_ID, res);
        });
    });

    socket.on(constant.CONST.REQUEST_EDIT_ROLE_BY_ID, function (id,name) {
        role.edit(id,name, function (res) {
            console.log(res);
            socket.emit(constant.CONST.RESPONSE_FIND_ROLE_BY_GARAGE_ID, res);
        });
    });

    //endregion

    socket.on('disconnect', function() {
        console.log('CLIENT DISCONNECT: ' + client_ip);
    });
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
