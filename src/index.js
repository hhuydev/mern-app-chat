const app = require('./app');
const http = require('http').Server(app);
const jwt = require('jsonwebtoken');
const HttpError = require('./utils/http-error');
const { ExpressPeerServer } = require('peer');

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log('Server is up on ' + port));

const {
    addUser,
    removeUser,
    getUser,
    getUserInRoom,
} = require('./utils/users');

const {
    generateMessage,
    generateLocationMessage,
    welcomeMessage,
} = require('./utils/message');

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

let count = 0;
io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
            socket.handshake.query.token,
            process.env.JWT_SECRET_KEY,
            (err, decoded) => {
                if (err)
                    return next(new HttpError('Authentication error', 401));
                socket.decoded = decoded;
                next();
            },
        );
    } else {
        next(new HttpError('Authentication error', 401));
    }
}).on('connection', (socket) => {
    console.log('Websocket is running!');

    socket
        .on('join', async ({ username, room }, callback) => {
            // const { error, user } = addUser({ id: socket.id, username, room });
            const { error, user } = await addUser({
                id: socket.id,
                userId: socket.decoded.userId,
                room,
            });
            socket.room = room;
            console.log(socket.room);
            if (!user) console.log('user not found');
            // if (error) return callback(error);
            /**socket ket noi room */
            // socket.join(user.room);
            socket.join(room);
            /**Gửi cho tat ca client*/
            socket.emit('message', welcomeMessage('Admin', 'Welcome!'));
            /**Gửi cho tất cả client trừ người gửi sẽ k thấy dc trong room*/
            socket.broadcast
                .to(room)
                .emit(
                    'message',
                    welcomeMessage('Admin', `${user.username} has joined!`),
                );
            io.to(room).emit('roomData', {
                room,
                users: getUserInRoom(room),
                user,
            });
            // callback();
        })
        .on('sendMessage', async (text, callback) => {
            // const user = getUser(socket.id);
            const { user, savedRoomName } = await getUser(
                socket.decoded.userId,
            );
            // const filter = new Filter();
            // if (filter.isProfane(text)) return callback("Profane is not allowed!");
            /**Gửi cho tất cả client & người gửi trong room*/
            io.to(savedRoomName).emit(
                'message',
                // generateMessage(user.username, text)
                generateMessage(user.username, text),
            );
            // callback();
        })
        .on('disconnect', async () => {
            // const user = removeUser(socket.id);
            const user = await removeUser(socket.id);

            if (user) {
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUserInRoom(user.room),
                });
                io.to(user.room).emit(
                    'message',
                    generateMessage('Admin', `${user.username} has left!`),
                );
            }
        })
        .on('sendLocation', ({ latitude, longtitude } = {}, callback) => {
            const user = getUser(socket.id);
            io.to(user.room).emit(
                'locationMessage',
                generateLocationMessage(
                    user.username,
                    `https://www.google.com/maps?q=${latitude},${longtitude}`,
                ),
            );
            callback('Location shared!');
        });
});

const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use('/peerjs', peerServer);
/**Dung cho ket noi */
