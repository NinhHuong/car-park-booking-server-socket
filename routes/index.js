var express = require('express');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.port||5000);

var account = require('../model/account');
var garage = require('../model/garage');
var constant = require('../other/constant');

console.log("Start server");
var clientsList = [];
io.sockets.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    clientsList.push(client_ip);
    console.log('CLIENT CONNECTED: ' + client_ip);

    //region ACCOUNT
    //Login request
    socket.on('check_email_and_password', function (account_detail) {
        var json = JSON.parse(account_detail);
        account.login(json["email"],json["password"],function (res){
            socket.emit('result_login', res);
        });
    });
	
	//Request salt string
    socket.on('request_get_salt', function (email) {
        account.login_request(email, function (res) {
            socket.emit('response_get_salt', res);
        });
    });

    //Request create new account
    socket.on('request_create_account', function (rigister_detail) {
		var json = JSON.parse(rigister_detail);
        account.register(json["email"], json["password"], json["salt"], json["roleID"], function (res) {
            socket.emit('response_create_account', res);
        });
    });

    //reset password
    socket.on('request_reset_password', function (email) {
        account.reset_pass_init(email, function (res) {
            console.log(res);
            socket.emit('response_reset_password', res);
        });
    });
    socket.on('request_change_password', function (email, code, npass) {
        account.reset_pass_change(email, code, npass, function (res) {
            console.log(res);
            socket.emit('response_change_password', res);
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
