require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const recruitPost = require("../schemas/recruitPost");
const recruitComment = require("../schemas/recruitComment");
const User = require("../schemas/user");
const moment = require("moment");

// 모집 게시글 작성
async function recruitPosts(req, res) {
  try {
      // 불러올 정보 및 받아올 정보
      const { nickname } = res.locals.user;
      const { title, content, age, date, time, place } = req.body;
      let status = false;
      const createdAt = moment().format('YYYY-MM-DD HH:mm');

      // 게시글 작성
      const createdPosts = await recruitPost.create({
          nickname,
          title,
          content,
          age,
          date,
          time,
          place,
          status,
          createdAt: createdAt
      });
      console.log(createdPosts)

      res.status(200).send({
          result: "true",
          message: "게시글이 성공적으로 등록되었습니다."
      });
  } catch (err) {
      res.status(400).send({
          result: "false",
          message: "게시글 작성 실패"
      });
  }
};

// 모집 게시글 전체조회
async function recruitAllGet(req, res) {
    try {
        const { authorization } = req.headers;

        //case1) 로그인 되어있을떄(포함되어있을경우 bookmarkStatus값만 true로 바꾸고, bookmarkUsers는 배열아닌 null로 바꿔 프론트에 전달 )
        if(authorization){
        const [authType, authToken] = authorization.split(" ");
        const decodedToken = jwt.decode(authToken, SECRET_KEY);
        const userNickname = decodedToken.nickname
        
        let recruitPosts = await recruitPost.find({}, { updatedAt: 0, _id: 0 });
        for(let i = 0; i <recruitPosts.length ; i++ ){         //forEach문? 다른거?로 바꾸면 더 효율 좋나?
            if( recruitPosts[i].bookmarkUsers.includes(userNickname) ){
                recruitPosts[i].bookmarkStatus = true
            }
            recruitPosts[i].bookmarkUsers = null
        }

        return res.status(200).send({
            recruitPosts: recruitPosts
         });
        }

        //case2) 비로그인 일떄 (bookmarkUsers 제외하고 보내기)
        let recruitPosts = await recruitPost.find({}, { updatedAt: 0, _id: 0, bookmarkUsers:0 });
        return res.status(200).send({
            recruitPosts
        });
        
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 전체조회 실패"
        });
    }
};

// 모집 게시글 상세조회
async function recruitGet(req, res) {
    try {
        const { authorization } = req.headers;
        //case1) 로그인 되어있을떄
        if(authorization){
            const [authType, authToken] = authorization.split(" ");
            const decodedToken = jwt.decode(authToken, SECRET_KEY);
            const userNickname = decodedToken.nickname

            const { recruitPostId } = req.params;
            const [recruitDetails] = await recruitPost.find({ recruitPostId: Number(recruitPostId) }, { _id: 0 });
            const recruitComments = await recruitComment.find({ recruitPostId: Number(recruitPostId) }, { _id: 0 }).sort({ recruitCommentId: -1 });
            if (!recruitDetails) {
                return res.status(400).send({ result: "false", message: "게시글이 없습니다."});
            }
            if( recruitDetails.bookmarkUsers.includes(userNickname)){
                recruitDetails.bookmarkStatus = true
            }
            return res.status(200).send({ recruitDetails, recruitComments });
        }
        
        //case2) 비로그인 일떄
        const { recruitPostId } = req.params;
        const [recruitDetails] = await recruitPost.find({ recruitPostId: Number(recruitPostId) }, { _id: 0 });
        const recruitComments = await recruitComment.find({ recruitPostId: Number(recruitPostId) }, { _id: 0 }).sort({ recruitCommentId: -1 });
        if (!recruitDetails) {
            return res.status(400).send({ result: "false", message: "게시글이 없습니다."});
        }
        return res.status(200).send({ recruitDetails, recruitComments });
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 상세조회 실패"
        });
    }
};

// 모집 게시글 수정
async function recruitUpdate(req, res) {
    try {
        const { recruitPostId } = req.params;
        const { title, content, age, date, time, place, status } = req.body;
        const { nickname } = res.locals.user;
        const recruitPosts = await recruitPost.findOne({ recruitPostId: Number(recruitPostId) });

        if (nickname === recruitPosts.nickname) {
            await recruitPost.updateOne({ recruitPostId }, { $set: { title, content, age, date, time, place, status }});
            res.status(200).send({
                result: "true",
                message: "게시글이 성공적으로 수정되었습니다."
            });
        } else {
            res.status(400).send({
                result: "false",
                message: "게시글 수정 권한 없음"
            });
        }
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 수정 실패"
        });
    }
};

// 모집 게시글 삭제(모집 댓글도 같이 삭제)
async function recruitDelete(req, res) {
    try {
        const { recruitPostId } = req.params;
        const { nickname } = res.locals.user;
        const recruitPosts = await recruitPost.findOne({ recruitPostId: Number(recruitPostId) })

        if (nickname === recruitPosts.nickname) {
            await recruitPost.deleteOne({ recruitPostId });
            await recruitComment.deleteMany({ recruitPostId });

            res.status(200).send({
                result: "true",
                message: "게시글이 성공적으로 삭제되었습니다."
            });
        } else {
            res.status(400).send({
                result: "false",
                message: "게시글 삭제 권한 없음"
            });
        }
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 삭제 실패"
        });
    }
};

// 모집 게시글 북마크 표시/해제
async function recruitBookmark(req, res) {
    try {
        const { recruitPostId } = req.params;
        const { nickname } = res.locals.user;
        const bookmarkPost = await recruitPost.findOne({ recruitPostId: Number(recruitPostId) });
        const user = await User.findOne({ nickname });
        console.log(bookmarkPost)
        if (!bookmarkPost.bookmarkUsers.includes(nickname)) {
            await bookmarkPost.updateOne({ $push: { bookmarkUsers: nickname }});
            await user.updateOne({ $push: { bookmarkList: recruitPostId }})
            res.status(200).send({
                result: "true",
                message: "북마크가 표시되었습니다."
            });
        } else {
            await bookmarkPost.updateOne({ $pull: { bookmarkUsers: nickname }});
            await user.updateOne({ $pull: { bookmarkList: recruitPostId }})
            res.status(200).send({
                result: "true",
                message: "북마크가 해제되었습니다."
            });
        }
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 북마크 표시/해제 실패"
        });
    }
}

module.exports = {
    recruitPosts,
    recruitAllGet,
    recruitGet,
    recruitUpdate,
    recruitDelete,
    recruitBookmark
  };