var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken');


router.get('/login', function (req, res) {
    res.render('auth/login');
})

router.post('/login', (req, res)=> {
    let {username, password} = req.body;
    UserModel.findOne({username: username, password: md5(password)}, null)
        .then((data) => {
            if (!data) {
                return res.json({
                    code:'2002',
                    msg: 'username or password is erroneous',
                    data:null
                });
            }
            let token=jwt.sign({
                username:data.username,
                _id: data._id,
            },'atguigu',{
                expiresIn: '1h'
            });
            res.json({
                code:'0000',
                msg: 'login successfully',
                data:token
            })
            res.redirect('/account')
        }).catch(err => {
        console.log(err)
        res.status(500).send('login failure');
        res.json({
            code:'2001',
            msg: 'login failed',
            data:null
        });
    })
});

router.post('/logout', function (req, res) {
    req.session.destroy(()=>{
        res.render('success',{msg: 'logout successfully',url:'/login'})
    })
})

module.exports = router;
