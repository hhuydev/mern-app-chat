const app = require("./app");
const http = require("http").Server(app);
const jwt = require("jsonwebtoken");
const HttpError = require("./utils/http-error");
const { ExpressPeerServer } = require("peer");
const Message = require("./models/Message");

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("Server is up on " + port));

const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");

const {
  generateMessage,
  generateLocationMessage,
  welcomeMessage,
  generateFileMessage,
} = require("./utils/message");

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let count = 0;
io.use(function (socket, next) {
  if (socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) return next(new HttpError("Authentication error", 401));
        socket.decoded = decoded;
        console.log("______________");
        next();
      }
    );
  } else {
    next(new HttpError("Authentication error", 401));
  }
}).on("connection", (socket) => {
  console.log("Websocket is running!");

  socket.on("join", async ({ username, room }, callback) => {
    // const { error, user } = addUser({ id: socket.id, username, room });
    const { error, user } = await addUser({
      id: socket.id,
      userId: socket.decoded.userId,
      room,
    });
    socket.room = room;
    console.log(socket.room);
    if (!user) console.log("user not found");
    // if (error) return callback(error);
    /**socket ket noi room */
    // socket.join(user.room);
    socket.join(room);

    io.to(room).emit("roomData", {
      room,
      users: getUserInRoom(room),
      user,
    });
    socket
      .on("sendMessage", async (text, callback) => {
        const { user, savedRoomName } = await getUser(socket.decoded.userId);

        io.to(savedRoomName).emit(
          "message",
          // generateMessage(user.username, text)
          generateMessage(user, text)
        );
      })
      .on("disconnect", async () => {
        const user = await removeUser(socket.id);
        if (user) {
          console.log("disconnect");

          io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room),
          });
        }
      });
  });
  //Client gửi message lên
});

/**Dung cho ket noi */
