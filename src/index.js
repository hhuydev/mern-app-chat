const app = require("./app");
const http = require("http").Server(app);

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

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
