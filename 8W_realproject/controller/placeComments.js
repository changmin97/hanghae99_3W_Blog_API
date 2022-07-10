const placePost = require("../schemas/placePost"); 
const placeComment = require("../schemas/placeComment");
const User = require("../schemas/user");

// 장소추천 댓글 등록
async function placeComments(req, res) {
    try {
        const { nickname } = res.locals.user;
        const { placePostId } = req.params;
        const { comment } = req.body;
        let status = false;

        // 게시글 찾기 
        const findPost = await placePost.findOne({ placePostId : Number(placePostId) });
        console.log(findPost)
        
        if(!findPost){
            res.status(400).send({
                result: "false",
                message: "게시글 번호가 없습니다 "
            });
        }
         
        // console.log("나와라요"+findPost.placePostId)

        // 게시글 작성
        const placeComments = await placeComment.create({
            nickname : nickname ,
            placePostId : findPost.placePostId, 
            comment : comment,
            
        });
        // console.log(placeComments)
  
        res.status(200).send({
            result: "true",
            message: "댓글이 성공적으로 등록되었습니다."
        });

    } 
    catch (err) {
        res.status(400).send({
            result: "false",
            message: "댓글 작성 실패"
        });
    }
};
 

// 장소추천 댓글 삭제 
async function placeCommentsDelete(req, res) {
    try {
        const { placePostId, placeCommentId } = req.params;
        const { nickname } = res.locals.user;
        
        const placeComments = await placeComment.findOne({ 
            placePostId: placePostId,
            placeCommentId: placeCommentId,
        });

        if(!placeComments.placeCommentId){
            return res.status(200).send({  
            result: "false",
            message: "이미 지워진 댓글입니다."
            });
        };
        
        if (!(placeComments.nickname==nickname)) {
            return res.status(200).send({  
                result: "false",
                message: "닉네임이 일치하지 않습니다"
            });
        }  

            await placeComment.deleteOne({ 
                placePostId: placePostId,
                placeCommentId: placeCommentId,
            });
       
        return res.status(200).send({
            result: "true",
            message: "댓글이 성공적으로 삭제되었습니다."
        });
         
    } 
    catch (err) {
        res.status(400).send({
            result: "false",
            message: "알 수 없는 에러가 발생하였습니다"
        });
}};

module.exports = {
    placeComments,
    placeCommentsDelete
};