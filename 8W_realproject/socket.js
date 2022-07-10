// // 초기 세팅
// const http = require('http');
// const socketIo = require('socket.io');
// const app = require('app');
// const server = http.createServer(app);

// // DB
// // const chatRoom = require("../schemas/chatRoom");

// const io = socketIo(server, {
//     cors: {
//         origin: '*',
//         methods: ["GET", "POST"],
//     }
// });

// // 소켓 연결
// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     // socket.on("join_room", (data) => {
//     //     // data에는 클라이언트에서 전송한 매개변수가 들어옴(이러한 매개변수에는 제한x)
//     //     socket.join(data); // 해당 채팅방 입장
//     //     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     //   });

//     socket.on("disconnect", () => {
//         console.log("User Disconnected", socket.id);
//       });
// });

// // module.exports = { server };