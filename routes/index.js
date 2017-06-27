var express = require('express');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.port||5000);

var ticket = require('../model/ticket');
var account = require('../model/account');
var token = require('../model/token');

console.log("Start server");
io.sockets.on('connection', function (socket) {
    console.log("someone connected");
    //region ticket
    socket.on('request open tickets', function(account_token) {
        console.log("server listen");
        ticket.getOpenTicketByAccount(account_token, function (res) {
            console.log(res);
            socket.emit('response open tickets', res);
        });
    });

    //endregion

    //region account
    //Login request
    socket.on('CheckEmailAndPassword', function (account_detail) {
        var json = JSON.parse(account_detail);
        account.login(json["Email"],json["Password"],function (res){
            socket.emit('ResultLogin', res);
        });
    });

    socket.on('RegistNewAccount', function (account_detail) {
        var json = JSON.parse(account_detail);
        account.register(json["Email"],json["Password"],function (res){
            socket.emit('ResultRegistNewAccount', res);
        });
    });

    //reset password
    socket.on('request reset password', function (email) {
        account.reset_pass_init(email, function (res) {
           console.log(res);
        });
    });
    socket.on('request change password', function (email, code, npass) {
        account.reset_pass_change(email, code, npass, function (res) {
            console.log(res);
        });
    });
    //endregion

    //region token
	socket.on('request create token', function(garage_id) {
		token.add(garage_id, function (res) {
            console.log(res);
            // socket.emit('response create ticket', res);
			//send to arduino
        })
	});

    socket.on('request validate token', function(ticket_id, token_input) {
        token.validate(ticket_id, token_input, function (res) {
            console.log(res);
            socket.emit('response validate ticket', res);
        })
    });
    //endregion
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
