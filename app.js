'use strict';

var amqp = require('amqplib/callback_api');

var message_bus_id = process.env.MESSAGE_BUS_ID;
var username = process.env.UNAME;
var pwd = process.env.PASSWD;

const opt = { credentials: require('amqplib').credentials.plain(username,pwd) };

console.log("Starting @" + new Date());

for( let param in process.env)
    console.log( param + "=" + process.env[param]);

amqp.connect('amqp://' + message_bus_id, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });

        if(process.env.MODE =='client'){
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
              console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
              });
        }
        else{
            setInterval(function() {
                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent %s", msg);
            }, 500);
        }
    });
});

console.log('Press any key to exit');

//process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));