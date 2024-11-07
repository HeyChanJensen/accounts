var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const md5 = require('md5');


router.get('/reg', function (req, res) {
    res.render('auth/reg');
})

router.post('/reg', function (req, res) {
    UserModel.create({...req.body, password: md5(req.body.password)}, null)
        .then(data => {
            res.render('success', {msg: 'success', url: '/login'})
        }).catch(err => {
        console.log(err);
        res.status(500).send('failure');
    })
})

router.get('/login', function (req, res) {
    res.render('auth/login');
})

router.post('/login', (req, res)=> {
    let {username, password} = req.body;
    UserModel.findOne({username: username, password: md5(password)}, null)
        .then((data) => {
            if (!data) {
                return res.send('login failed');
            }
            req.session.username = data.username;
            req.session._id = data._id;
            res.redirect('/account')
        }).catch(err => {
            console.log(err)
            res.status(500).send('login failure');
    })
});

router.post('/logout', function (req, res) {
    req.session.destroy(()=>{
        res.render('success',{msg: 'logout successfully',url:'/login'})
    })
})

module.exports = router;
