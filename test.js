const net = require('net');
const path = require('path');

/**
 * Test if a given path is a valid Unix domain socket
 * @param {string} path - The file path to test
 * @returns {Promise<boolean>} - Resolves to true if the path is a valid socket, false otherwise
 */
function isValidUnixSocket(path) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ path }, () => {
      // If we successfully connect, it's a valid socket
      client.end();
      resolve(true);
    });

    client.on('error', (err) => {
      // Handle the error, which could be a sign of it not being a socket
      if (err.code === 'ENOENT') {
        // Path doesn't exist, so it's not a socket
        resolve(false);
      } else {
        reject(err);  // Other errors may be thrown, like permission issues
      }
    });
  });
}

// Example usage
const socketPath = path.join(__dirname, 'my_socket.sock');

isValidUnixSocket(socketPath)
  .then(isValid => {
    if (isValid) {
      console.log(`${socketPath} is a valid Unix domain socket.`);
    } else {
      console.log(`${socketPath} is not a Unix domain socket.`);
    }
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });
