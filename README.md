# UDP -> Web Socket Example

This example illustrates a Node.js server that will relay OSC messages sent via
a UDP socket (listening on port 57121) to a web page using a Web Socket connection.

## Installation

1. Run <code>npm install</code> in the terminal to install all required Node dependencies
2. In the <code>web</code> directory, run <code>npm install</code> to install all web dependencies

## Running the Example

1. Run <code>node .</code> in the Terminal
2. Open <code>http://localhost:8081</code> in your browser
3. Control the synth using OSC messages sent from Lemur or another OSC server
