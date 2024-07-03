// middleware.js
function checkSession(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login'); // 로그인 페이지로 리디렉션
    }
}

module.exports = checkSession;
