const app = require("./app");
const http = require("http").Server(app);
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("Server is up on " + port));
// http.listen(3000, () => {
//   console.log(`Socket.IO server running at http://localhost:${port}/`);
// });

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  // if (socket.handshake.query && socket.handshake.query.token) {
  //   jwt.verify(
  //     socket.handshake.query.token,
  //     process.env.JWT_SECRET_KEY,
  //     function (err, decoded) {
  //       if (err) return next(new Error("Authentication error"));
  //       socket.decoded = decoded;
  //       next();
  //     }
  //   );
  if (socket.req) {
    console.log(socket.req);
    next();
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", function (socket) {
  // Connection now authenticated to receive further events
  console.log("Connected: " + req.user);
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
