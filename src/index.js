/**
 * Module dependencies.
 */
import dotenv from 'dotenv';
import http from 'http';
import debug from 'debug';
import app from './app.js';

dotenv.config();

const appDebug = debug('authentication-server:server');

if (!process.env.JWT_ENCRYPT_ALGLORITHM) {
  throw new Error('JWT_ENCRYPT_ALGLORITHM is not set');
}

if (!process.env.JWT_ENCRYPT_SECRET) {
  throw new Error('JWT_ENCRYPT_SECRET is not set');
}

if (!process.env.JWT_EXPIRATION_ACCESS_TOKEN) {
  throw new Error('JWT_EXPIRATION_ACCESS_TOKEN is not set');
}

if (!process.env.JWT_EXPIRATION_REFRESH_TOKEN) {
  throw new Error('JWT_EXPIRATION_REFRESH_TOKEN is not set');
}

const normalizePort = (val) => {
  const portNumber = parseInt(val, 10);

  if (Number.isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  appDebug(`Listening on ${bind}`);
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
