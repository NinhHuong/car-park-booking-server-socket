var express = require('express');
var router = express.Router();var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.PORT || 3000);

var ticket = require('../model/ticket');
var account = require('../model/account');

console.log("Start server");
io.sockets.on('connection', function (socket) {
    console.log("someone connected");
    //region ticket
    socket.on('request open tickets', function(account_token) {
        console.log("server listen")
        ticket.getOpenTicketByAccount(account_token, function (res) {
            console.log(res);
            socket.emit('response open tickets', res);
        });
    });

    //endregion

    //Login request
    socket.on('CheckEmailAndPassword', function (account_detail) {
        var json = JSON.parse(account_detail);
        account.login(json["Email"],json["Password"],function (res){
            socket.emit('ResultLogin', res);
        });
    })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
