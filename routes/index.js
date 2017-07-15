var express = require('express');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.port||5000);

var account = require('../model/account');
var garage = require('../model/garage');

console.log("Start server");
io.sockets.on('connection', function (socket) {
    console.log("someone connected");

    //region ACCOUNT
    //Login request
    socket.on('CheckEmailAndPassword', function (account_detail) {
        var json = JSON.parse(account_detail);
        account.login(json["Email"],json["Password"],function (res){
            socket.emit('ResultLogin', res);
        });
    });

    socket.on('request create account', function (email, pass) {
        account.register(email, pass, function (res) {
            socket.emit('response create account', res);
        });
    });

    //reset password
    socket.on('request reset password', function (email) {
        account.reset_pass_init(email, function (res) {
            console.log(res);
            socket.emit('response reset password', res);
        });
    });
    socket.on('request change password', function (email, code, npass) {
        account.reset_pass_change(email, code, npass, function (res) {
            console.log(res);
            socket.emit('response change password', res);
        });
    });
    //endregion


    //region GARAGES
    socket.on('request_all_garages', function() {
        garage.getAllGarages(function (res) {
            socket.emit('response_all_garages', res);
        })
    });
    //endregion
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
