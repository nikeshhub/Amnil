const http = require("http");
const httpServer = http.createServer();

httpServer.on("connection", () => {
  console.log("New connection");
});

httpServer.on("request", (req, res) => {
  console.log("New HTTP request", req);
  res.end("Hello, World!");
});

httpServer.listen(9090, () => {
  console.log(`Listening on port ${9090}`);
});

module.exports = httpServer;
