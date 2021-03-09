const http = require('http');
const app = require('./app');


const port = 3000; // here add before the process.env.PORT ||


const server = http.createServer(app);

server.listen(port, function(){
    console.log('Server started on port' +port + '...');
});