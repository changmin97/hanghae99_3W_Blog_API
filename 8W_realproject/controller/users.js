require("dotenv").config();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Bcrypt = require("bcrypt");
const passport = require("passport");
const SALT_NUM = process.env.SALT_NUM;
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// 회원가입 조건
const signUpSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .label("이메일 형식이 유효하지 않습니다."),
    nickname: Joi.string()
        .pattern(new RegExp("^[0-9A-Za-z가-힣]{2,12}$"))
        .required()
        .label("닉네임은 한글, 영문 대/소문자, 숫자, 2~12자 이여야 합니다."),
    password: Joi.string()
        .pattern(new RegExp("^[0-9A-Za-z]{4,16}$"))
        .required()
        .label("비밀번호는 한글, 영문 대/소문자 4~16자 이여야 합니다."),
    passwordCheck: Joi.string(),
});

async function signup(req, res, next) {
    try {
        const { email, nickname, password, passwordCheck } =
            await signUpSchema.validateAsync(req.body);
        const existUser = await User.findOne({ email });
        // console.log('existUser정보',existUser)
        //이미 이메일이 존재하는 경우
        if (existUser) {
            return res.status(400).json({
                message: "사용중인 이메일입니다.",
                result: false,
            });
        }
        const existnickname = await User.findOne({ nickname });
        //이미 닉네임이 존재하는 경우
        if (existnickname) {
            return res.status(400).json({
                message: "사용중인 닉네임입니다.",
                result: false,
            });
        }
        // 비밀번호와 비밀번호 확인란이 일치하지 않을 경우
        if (password !== passwordCheck) {
            return res.status(400).json({
                message: "비밀번호 확인란이 일치하지 않습니다.",
                result: false,
            });
        }

        const salt = await Bcrypt.genSalt(Number(SALT_NUM));
        const hashPassword = await Bcrypt.hash(password, salt); // 비밀번호 암호화
        const user = new User({
            email,
            nickname,
            password: hashPassword,
            myComment: "",
            profileUrl: "https://changminbucket.s3.ap-northeast-2.amazonaws.com/basicProfile.png",
            refreshToken: "",
            snsId: "",
            provider: "",
        });
        // console.log("db에 저장될 user정보입니다.",user)
        await user.save();
        return res.status(201).send({
            message: "회원가입에 성공하였습니다.",
            result: true,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.details[0].context.label,
            result: false,
        });
    }
}

async function signin(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                result: false,
                message: "이메일 또는 패스워드가 틀렸습니다.",
            });
        }
        const nickname = user.nickname;
        const bcpassword = await Bcrypt.compare(password, user.password);
        if (!bcpassword) {
            return res.status(400).json({
                message: "이메일 또는 패스워드가 틀렸습니다.",
                result: false,
            });
        }
        const accessToken = jwt.sign({ nickname: user.nickname }, SECRET_KEY, {
            expiresIn: "4h",
        });
        const refreshToken = jwt.sign({}, REFRESH_SECRET_KEY, {
            expiresIn: "14d",
        });
        console.log("accessToken이 생성되었습니다.", accessToken);
        console.log("refreshToken이 생성되었습니다.", refreshToken);
        await User.updateOne(
            { nickname: user.nickname },
            { refreshToken: refreshToken }
        );
        return res.json({
            result: true,
            accessToken,
            nickname,
        });
    } catch (err) {
        return res.status(400).json({
            message: err,
            result: false,
        });
    }
}

//   [passport-local 이용 함수]
// async function signup (req, res, next) {
// passport.authenticate('local', (authError, user, info) => {
//   if (authError) {
//     console.error(authError);
//     return next(authError);
//   }
//   if (!user) {
//     return res.send('user가 존재하지 않습니다.')    //기존 코드 return res.redirect(`/?loginError=${info.message}`);
//   }
//   return req.login(user, (loginError) => {
//     if (loginError) {
//       console.error(loginError);
//       return next(loginError);
//     }
//     return res.send('로컬로그인 완료되었습니다.')     // <= 원래 코드 return res.redirect('/');
//   });
// })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
// }

module.exports = {
    signup,
    signin,
};