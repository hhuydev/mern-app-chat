const app = require("./app");
const http = require("http").Server(app);
const jwt = require("jsonwebtoken");

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

//Auth by socket.io
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    console.log(token);
    // const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.handshake.query.token);
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
