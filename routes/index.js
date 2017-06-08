var express = require('express');
var router = express.Router();var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.PORT || 3000);

var ticket = require('../model/ticket');
var token = require('../model/token');

io.sockets.on('connection', function (socket) {
    console.log("someone connected");

    socket.on('request open tickets', function(account_token) {
        ticket.getOpenTicketByAccount(account_token, function (res) {
            console.log(res);
            socket.emit('response open tickets', res);
        });
    });
	
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
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
