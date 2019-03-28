const express = require('express');

const config = require('./config/config.js');

const app = express();

console.log(config.server.host);
