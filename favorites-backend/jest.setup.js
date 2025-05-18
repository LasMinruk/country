const { TextEncoder, TextDecoder } = require('node:util');
const { Buffer } = require('node:buffer');

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  Buffer,
}); 