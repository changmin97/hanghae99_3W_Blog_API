require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const connect = require("./database/database.js");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./passport");
const cookieParser = require("cookie-parser");
// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger-output");

// 초기 세팅
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// DB
const chatMessage = require("./schemas/chatMessage");
const chatRoom = require("./schemas/chatRoom");
connect();

//라우터
const recruitPostsRouter = require("./routes/recruitPosts");
const recruitCommentsRouter = require("./routes/recruitComments");
const placePostsRouter = require("./routes/placePosts");
const placeCommentsRouter = require("./routes/placeComments");
const reviewPostsRouter = require("./routes/reviewPosts");
const reviewCommentsRouter = require("./routes/reviewComments");
const mypagesRouter = require("./routes/mypages");
// const bookmarksRouter = require("./routes/bookmarks");
const chatRoomsRouter = require("./routes/chatRooms");
const chatMessagesRouter = require("./routes/chatMessages");
const usersRouter = require("./routes/users");
const mainRouter = require("./routes/mains")
passportConfig();

//미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cookieParser());

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    "/api",
    express.urlencoded({ extended: false }),
    [recruitPostsRouter],
    [recruitCommentsRouter],
    [placePostsRouter],
    [placeCommentsRouter],
    [reviewPostsRouter],
    [reviewCommentsRouter],
    [chatRoomsRouter],
    [chatMessagesRouter],
    [mypagesRouter],
    [mainRouter],
    // [bookmarksRouter]
);

app.use("/api/users", express.urlencoded({ extended: false }), [usersRouter]);

// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
    res.send("redirect 테스트하기위한 루트 페이지입니다.");
});

// 없는 url로 요청한 경우
app.use((req, res, next) => {
    res.status(404).send("존재하지 않는 url주소 입니다.");
});
// 서버 에러 핸들링
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send("서버에 에러가 발생하였습니다.");
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});

// const createRoom = async (recruitPostId, nickname) => {
//     return room = await chatRoom.create({
//         recruitPostId: recruitPostId,
//         nickname: nickname
//     })
// }

// const createMessage = async (roomId, senderNick, message) => {
//     return await chatMessage.create({
//         roomId: roomId,
//         senderNick: nickname,
//         message: message
//     });
// };

// 조건문(chatRoom db에 nickname이랑 postNickname이 있을 경우 새로운 방 생성이 아닌 기존 방 입장)

// recruitPostId, nickname이 둘 다 있다면

// 소켓 연결
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
            let roomId = data.nickname + data.recruitPostId;
            socket.join(roomId);
            socket.emit("test", roomId)
            console.log(`User with ID: ${socket.id} joined room: ${roomId}`)
            console.log(data)
        });
    
    socket.on("send_message", (data) => {
            // const message = new chatMessage(data);
            // message.save().then(() => {
            // 룸으로 receive_message 이벤트 송신(방에 접속한 클라이언트에게 메시지 전송)
            // const chatRoomId = await chatRoom.findOne({ roomId: data.roomId });
            socket.to(data.roomId).emit("receive_message", data);
            console.log('data: ', data);
            console.log('data.room: ', data.roomId);
        // });
    });

    // socket.on("send_message", ({recruitPostId: roomId, nickname, message}) => {
    //     createMessage(roomId, nickname, message).then((data) => {
    //         socket.broadcast.to(roomId).emit('message', {
    //             recruitPostId: data.recruitPostId,
    //             nickname: data.nickname,
    //             message: data.message,
    //             createdAt: data.createdAt
    //         });
    //     });
    // });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
});


        // data에는 클라이언트에서 전송한 매개변수가 들어옴(이러한 매개변수에는 제한x)
        // socket.join(data); // 해당 채팅방 입장

        // const chats = await chatMessage.find({ data: Number(data) });
        // io.to(data.roomId).emit("load", chats);
        //   });

      // send_message 이벤트 수신(접속한 클라이언트의 정보가 수신되면)
    //   socket.on("send_message", (data) => {
    //     const message = new chatMessage(data);
    //     message.save().then(() => {
        // 룸으로 receive_message 이벤트 송신(방에 접속한 클라이언트에게 메시지 전송)
            // const chatRoomId = await chatRoom.findOne({ roomId: data.roomId });
    //         io.emit("receive_message", data);
    //         console.log('data: ', data);
    //         console.log('data.room: ', data.roomId);
    //     });
    // });


server.listen(PORT, () => {
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
});

module.exports = app;