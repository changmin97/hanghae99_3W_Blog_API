require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const placePost = require("../schemas/placePost");
const placeComment = require("../schemas/placeComment");
const User = require("../schemas/user");

// 장소추천 게시글 작성
async function placePosts(req, res) {
  try {
      // 불러올 정보 및 받아올 정보
      const { nickname } = res.locals.user;
      const { title, content, region, imageUrl, star } = req.body;

      // 게시글 작성
      const createdPosts = await placePost.create({
          nickname,
          title,
          content,
          region,
          imageUrl,
          star
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

// 장소추천 게시글 전체조회
async function placeAllGet(req, res) {
    try {
        const { authorization } = req.headers;
        if(authorization){
            const [authType, authToken] = authorization.split(" ");
            const decodedToken = jwt.decode(authToken, SECRET_KEY);
            const userNickname = decodedToken.nickname

            let placePosts = await placePost.find({}, { updatedAt: 0, _id: 0 });
            for(let i = 0; i <placePosts.length ; i++ ){
                if( placePosts[i].bookmarkUsers.includes(userNickname) ){
                    placePosts[i].bookmarkStatus = true
                }
                placePosts[i].bookmarkUsers = null
            }
            return res.send({
                placePosts
            })
        }

        const placePosts = await placePost.find({}, { updatedAt: 0, _id: 0, bookmarkUsers:0 });
        res.status(200).send({placePosts: placePosts});
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 전체조회 실패"
        });
    }
};

// 장소추천 게시글 상세조회
async function placeGet(req, res) {
    try {
        const { placePostId } = req.params;
        const [placeDetails] = await placePost.find({ placePostId: Number(placePostId) }, { _id: 0 });
        const placeComments = await placeComment.find({ placePostId: Number(placePostId) }, { _id: 0 }).sort({ placeCommentId: -1 });
        if (!placeDetails) {
            return res.status(400).send({ result: "false", message: "게시글이 없습니다."});
        } else {
            return res.status(200).send({ placeDetails, placeComments });
        }
    } catch (err) {
        res.status(400).send({
            result: "false",
            message: "게시글 상세조회 실패"
        });
    }
};

// 장소추천 게시글 수정
async function placeUpdate(req, res) {
    try {
        const { placePostId } = req.params;
        const { title, content, region, imageUrl, star } = req.body;
        const { nickname } = res.locals.user;
        const placePosts = await placePost.findOne({ placePostId: Number(placePostId) });

        if (nickname === placePosts.nickname) {
            await placePost.updateOne({ placePostId }, { $set: { title, content, region, imageUrl, star }});
 
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

// 장소추천 게시글 삭제(장소추천 리뷰 댓글도 같이 삭제)
async function placeDelete(req, res) {
    try {
        const { placePostId } = req.params;
        const { nickname } = res.locals.user;
        const placePosts = await placePost.findOne({ placePostId: Number(placePostId) })

        if (nickname === placePosts.nickname) {
            await placePost.deleteOne({ placePostId });
            await placeComment.deleteMany({ placePostId });

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

// 장소추천 게시글 북마크 표시/해제
async function placeBookmark(req, res) {
    try {
        const { placePostId } = req.params;
        const { nickname } = res.locals.user;
        const bookmarkPost = await placePost.findOne({ placePostId: Number(placePostId) });
        const user = await User.findOne({ nickname });
        console.log(bookmarkPost)
        if (!bookmarkPost.bookmarkUsers.includes(nickname)) {
            await bookmarkPost.updateOne({ $push: { bookmarkUsers: nickname }});
            await user.updateOne({ $push: { bookmarkList: placePostId }})
            res.status(200).send({
                result: "true",
                message: "북마크가 표시되었습니다."
            });
        } else {
            await bookmarkPost.updateOne({ $pull: { bookmarkUsers: nickname }});
            await user.updateOne({ $pull: { bookmarkList: placePostId }})
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
    placePosts,
    placeAllGet,
    placeGet,
    placeUpdate,
    placeDelete,
    placeBookmark,
  };