const net = require('net');
const fs = require('fs');
const path = require('path');

// Define the path for the Unix socket (it will be a file on your filesystem)
const socketPath = path.join(__dirname, 'my_socket.sock');

// Ensure the socket file does not already exist
if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

// Create a server using the Unix domain socket
const server = net.createServer((client) => {
  console.log('Client connected');

  client.on('data', (data) => {
    console.log('Received:', data.toString());
    client.write('Hello from server');
  });

  client.on('end', () => {
    console.log('Client disconnected');
  });
});

// Listen on the Unix socket file
server.listen(socketPath, () => {
  console.log(`Server listening on ${socketPath}`);
});

// Handle process exit and cleanup the socket file
process.on('SIGINT', () => {
  server.close(() => {
    fs.unlinkSync(socketPath);
    console.log('Server closed, socket file removed');
    process.exit();
  });
});
