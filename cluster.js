const cluster = require('cluster');
const os = require('os');

const numCpu = os.cpus().length;

if (cluster.isMaster) {
	for (let i = 0; i < numCpu; i++) {
		cluster.fork();
	}
}
else {
	require('./main.js');
}