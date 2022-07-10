require("dotenv").config();
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../schemas/user");

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_CLIENT_ID,
                callbackURL: process.env.KAKAO_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log("로그인 성공시 유저의 카카오 프로필 정보", profile);
                try {
                    const exUser = await User.findOne({
                        $and: [{ snsId: profile.id }, { provider: "kakao" }], // where: { snsId: profile.id, provider: 'kakao' },
                    });
                    // console.log("exUser정보입니다.", exUser);
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email: profile._json.kakao_account.email, //기존코드 email: profile._json && profile._json.kakao_account_email,
                            nickname:
                                profile.displayName +
                                Math.floor(Math.random() * 100000000),
                            password: process.env.KAKAO_BASIC_PASSWORD,
                            myComment: "",
                            profileUrl: "https://changminbucket.s3.ap-northeast-2.amazonaws.com/basicProfile.png",
                            refreshToken: "",
                            snsId: profile.id,
                            provider: "kakao",
                        });
                        // console.log("newUser정보", newUser);
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
