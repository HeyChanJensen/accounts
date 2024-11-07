const jwt = require("jsonwebtoken");
const {SECRET}=require("../config/config");
module.exports = (req, res, next) => {
    let token = req.get('token');
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token 缺失',
            data: null
        })
    }
    jwt.verify(token, `${SECRET}`, (err, data) => {
        if (err) {
            return res.json({
                code: '0000',
                msg: '校验失败',
                data: data
            });
        }
    });
    //保存用户的信息
    req.user = data; // req.session  req.body
    //如果 token 校验成功
    next();
}