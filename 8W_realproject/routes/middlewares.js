exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        //passport 모듈에 내장된 함수. req.user 값 존재하면(즉 로그인해서 세션에저장되있으면)true, 없으면 false 반환
        next();
    } else {
        res.status(403).send("로그인 필요");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent("로그인한 상태입니다.");
        res.redirect(`/?error=${message}`);
    }
};
