var jackrabbit = require('jackrabbit');

var rabbit = jackrabbit("amqp://mdyelefh:FUT71qDv9s22hi-F2ERasLIh_vYOg2Tw@zebra.rmq.cloudamqp.com/mdyelefh");
var exchange = rabbit.default();
var hello = exchange.queue({ name: 'task_queue', durable: true });

exchange.publish({ name: 'Hunter' }, { key: 'task_queue' });
// exchange.on('drain', process.exit);