var express = require('express');
var router = express.Router();var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.PORT || 3000);

var ticket = require('../model/ticket');

io.sockets.on('connection', function (socket) {
    console.log("someone connected");

    socket.on('request open tickets', function(account_token) {
        ticket.getOpenTicketByAccount(account_token, function (res) {
            console.log(res);
            socket.emit('response open tickets', res);
        });
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
