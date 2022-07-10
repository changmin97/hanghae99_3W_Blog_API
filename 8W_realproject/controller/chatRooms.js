const chatRoom = require("../schemas/chatRoom");
// const chatMessage = require("../schemas/chatMessage");
const recruitPost = require("../schemas/recruitPost");
const User = require("../schemas/user");
const moment = require("moment");

// 채팅방 생성
async function chatRooms(req, res) {
    try {
        // 불러올 정보 및 받아올 정보
        const { nickname } = res.locals.user; // 로그인한 사용자 닉네임
        const { recruitPostId } = req.params; // 게시글 번호
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const existPost = await recruitPost.findOne({recruitPostId: Number(recruitPostId), nickname: nickname}); // 게시글-닉네임 존재 여부 확인위함
        const existPostId = await recruitPost.findOne({recruitPostId: Number(recruitPostId)}); // 게시글 번호 존재여부 확인 위함
        const existRoom = await chatRoom.findOne({recruitPostId: Number(recruitPostId), nickname: nickname}); // 방 존재 여부 확인위함

        // console.log(recruitPostId);
        // console.log(existPost);
        // console.log(existPostId);
        // console.log(existRoom);

        // 이미 채팅방 만들어져있는 경우
        if ( existRoom ) {
           return res.status(400).send({
                result: "false",
                message: "이미 만들어진 채팅방이 존재합니다.",
                roomId: existRoom.roomId
            });
        }

        // 본인이 본인 채팅방 들어가는 경우
        if ( existPost ) {
            return res.status(400).send({
                result: "false",
                message: "본인이 본인 채팅하는 것은 불가합니다."
            });
        }

        // 게시글 번호 존재 여부 확인
        if (!existPostId) {
            return res.status(400).send({ 
                result: "false", 
                message: "게시글이 없습니다."});
        }

        // 채팅방 생성
        const createdChats = await chatRoom.create({
                recruitPostId,
                nickname,
                postNickname: existPostId.nickname,
                postTitle: existPostId.title,
                createdAt: createdAt
        })
            // console.log(createdChats);
            
        return res.status(200).send({
                result: "true",
                message: "채팅방이 생성되었습니다.",
                roomId: createdChats.roomId
        });
    } catch (err) {
        return res.status(400).send({
            result: "false",
            message: "채팅방 생성 실패"
            });
        };
    };

// 유저의 채팅방 전체조회
async function chatRoomsAllGet(req, res) {
    try{
        const { nickname } = res.locals.user; // 로그인한 사용자 닉네임
        // const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const chatRoomList = await chatRoom.find({
            $or: [
            {nickname: nickname},
            {postNickname: nickname}
            ]}
        );
        // console.log(chatRoomList);
        
        return res.status(200).send({chatRoomList: chatRoomList});

    } catch (err) {
        return res.status(400).send({
            result: "false",
            message: "채팅방 전체조회 실패"
        });
    };
};

module.exports = {
    chatRooms,
    chatRoomsAllGet
};