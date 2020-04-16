var osc = require("osc"),
    express = require("express"),
    WebSocket = require("ws");
    fs = require('fs');
    http = require('http'); 

var writeJson = function (data) {
    fs.writeFileSync('test.json', data);
}
var getIPAddresses = function () {
    var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

    for (var deviceName in interfaces){
        var addresses = interfaces[deviceName];

        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 7500
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log("Broadcasting OSC over UDP to", udpPort.options.remoteAddress + ", Port:", udpPort.options.remotePort);
    console.log("To start the demo, go to http://localhost:8081 in your web browser.");
});

udpPort.open();

var appResources = __dirname + "/web",
    app = express(),
    server = app.listen(8081),
    wss = new WebSocket.Server({
        server: server
    });
var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}
app.use("/", express.static(appResources));
app.use(myLogger)

// Create an Express-based Web Socket server to which OSC messages will be relayed.
wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });
});