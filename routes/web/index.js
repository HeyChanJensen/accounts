var express = require('express');
var router = express.Router();
//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

let checkLoginMiddleware = require('../../middlewares/checkMiddleware');

router.get('/', (req, res) => {
    res.redirect('/account')
})
//记账本的列表
router.get('/account', checkLoginMiddleware,function (req, res, next) {

    //读取集合信息
    AccountModel.find().sort({ time: -1 }).exec()
        .then(data => {
            res.render('list', { accounts: data, moment: moment });
        })
        .catch((err) => {
            console.log('读取失败~~~');
        })
});

//添加记录
router.get('/account/create',checkLoginMiddleware, function (req, res, next) {
    res.render('create');
});

//新增记录
router.post('/account',checkLoginMiddleware,  (req, res) => {
    //插入数据库
    AccountModel.create({
        ...req.body,
        //修改 time 属性的值
        time: moment(req.body.time).toDate()
    }).then(data => {
        res.render('success', { msg: '添加成功', url: '/account' });

    }).catch(err => {
        res.status(500).send('插入失败~~');
    })
});

//删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
    //获取 params 的 id 参数
    let id = req.params.id;
    //删除
    AccountModel.deleteOne({ _id: id })
        .then(data => {
            res.render('success', { msg: '删除成功', url: '/account' });
        })
        .catch(err => {
            res.status(500).send('删除失败');
        })
});

module.exports = router;
