const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../schemas/user");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email", //req.body.email값
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    // console.log(email,password)
                    // const exUser = await User.findOne({ where: { email } }); 이걸로하면 맨처음것만 찾는 현상
                    const exUser = await User.findOne({ email });
                    console.log("exUser정보입니다.", exUser);
                    if (exUser) {
                        const result = await bcrypt.compare(
                            password,
                            exUser.password
                        );
                        if (result) {
                            done(null, exUser);
                        } else {
                            done(null, false, {
                                message: "비밀번호가 일치하지 않습니다.",
                            });
                        }
                    } else {
                        done(null, false, {
                            message: "가입되지 않은 회원입니다.",
                        });
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
