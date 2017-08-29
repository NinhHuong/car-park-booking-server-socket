/**
 * Created by Quang Si on 8/3/2017.
 */

var db = require('../database/dbConfig');
var db_error = require('../database/db_error');
var car = require('../model/car');
var admin = require("firebase-admin");
var parkingInfo = require('../model/parkingInfo');

var timerBookingNotify;
var timerBookingCancelNotify;

exports.StartBookingTimeout = function (notifyTimeout, cancelTimeout, notifyToken) {
    console.log("Set booking time out: " + notifyTimeout);
    if (timerBookingNotify !== null) {
        clearTimeout(timerBookingNotify);
    }
    if (timerBookingCancelNotify !== null) {
        clearTimeout(timerBookingCancelNotify);
    }
    timerBookingNotify = setTimeout(function () {
        exports.NotifyBookingTimeout(notifyToken);
    }, notifyTimeout);

    timerBookingCancelNotify = setTimeout(function () {
        exports.NotifyBookingCanceledTimeout(notifyToken);
    }, cancelTimeout);
};

exports.StopBookingTimeout = function () {
    clearTimeout(timerBookingNotify);
    clearTimeout(timerBookingCancelNotify);
    console.log("StopBookingTimeout success")
};

exports.NotifyBookingTimeout = function (notifyToken) {
    console.log("RegistrationToken: " + notifyToken);
// click_action: "BookingActi"
    var payload = {
        data: {
            mess: "booking_timeout"
        }
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(notifyToken, payload, options)
        .then(function (response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });
};

exports.NotifyBookingCanceledTimeout = function (notifyToken) {
    console.log("RegistrationToken: " + notifyToken);
// click_action: "BookingActi"
    var payload = {
        data: {
            mess: "booking_canceled"
        }
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(notifyToken, payload, options)
        .then(function (response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });
};