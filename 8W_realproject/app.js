require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const connect = require("./database/database.js");
const morgan = require('morgan');
const helmet = require('helmet');
connect();
//라우터
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

//미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet())
app.use(morgan('tiny'))

app.use(
  "/api",
  express.urlencoded({ extended: false }),
  [postsRouter],
  [commentsRouter],
);

app.use(
  "/api/user",
  express.urlencoded({ extended: false }),
  [usersRouter]
);



// 없는 url로 요청한 경우
app.use((req, res, next) => {
  res.status(404).send('존재하지 않는 url주소 입니다.')
});
// 서버 에러 핸들링
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('서버에 에러가 발생하였습니다.')
});

app.listen(PORT,()=>{
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`)
})