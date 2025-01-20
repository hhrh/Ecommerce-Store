const app = require("./server.js");
const serverless = require("serverless-http");

module.exports.handler = serverless(app);
