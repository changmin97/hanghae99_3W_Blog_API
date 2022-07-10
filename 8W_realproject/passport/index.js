const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../schemas/user");

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log("user.email정보", user.nickname);
        done(null, user.nickname); //세션에 user의 id만 저장, 나는nickname으로 바꿔야할듯 , user통쨰로 저장도 되긴함
    }); // { id: 3, 'connect.sid': s%13252733005634 } 이런식으로 세션쿠키와 id저장

    passport.deserializeUser((id, done) => {
        //이부분 변수명을 email로 바꿔야 안헷갈릴껄?
        User.findOne({ where: { id } }) //이부분 변수명을 email로 바꿔야 안헷갈릴껄?
            .then((user) => done(null, user)) // req.user 로 로그인한 유저 정보 접근가능
            .catch((err) => done(err));
    });

    local();
    kakao();
};
