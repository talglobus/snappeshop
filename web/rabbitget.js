var jackrabbit = require('jackrabbit');

var rabbit = jackrabbit("amqp://mdyelefh:FUT71qDv9s22hi-F2ERasLIh_vYOg2Tw@zebra.rmq.cloudamqp.com/mdyelefh");
var exchange = rabbit.default();
var hello = exchange.queue({ name: 'task_queue', durable: true });

hello.consume(onGreet);

function onGreet(data, ack) {
	console.log('Data is ' + data.name + '!');
	ack();
}