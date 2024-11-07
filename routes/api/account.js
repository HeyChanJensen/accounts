var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');
//记账本的列表
router.get('/account', checkTokenMiddleware,function (req, res, next) {
    //读取集合信息
    AccountModel.find().sort({time: -1}).exec()
        .then(data => {
            res.json({
                // 四个0表示成功
                code: '0000',
                msg: 'success',
                data: data
            })
        })
        .catch((err) => {
            res.json({
                code: '1001',
                msg: 'failure',
                data: null
            })
        })
});

router.get('/account/:id',checkTokenMiddleware, function (req, res, next) {
    let id = req.params.id;
    //读取集合信息
    AccountModel.findById(id).exec()
        .then(data => {
            res.json({
                // 四个0表示成功
                code: '0000',
                msg: 'success',
                data: data
            })
        })
        .catch((err) => {
            res.json({
                code: '1004',
                msg: 'failure',
                data: null
            })
        })
});

//新增记录
router.post('/account',checkTokenMiddleware, (req, res) => {
    //插入数据库
    AccountModel.create({
        ...req.body,
        //修改 time 属性的值
        time: moment(req.body.time).toDate()
    }).then(data => {
        res.json({
            code: '0000',
            msg: 'success',
            data: data
        })
    }).catch(err => {
        res.json({
            code: '1002',
            msg: 'failure',
            data: null
        })
    })
});

//删除记录
router.delete('/account/:id', checkTokenMiddleware,(req, res) => {
    //获取 params 的 id 参数
    let id = req.params.id;
    //删除
    AccountModel.deleteOne({_id: id})
        .then(data => {
            res.json({
                code: '0000',
                msg: 'success',
                data: {}
            })
        })
        .catch(err => {
            res.json({
                code: '1003',
                msg: 'failure',
                data: null
            })
        })
});

router.patch('/account/:id', checkTokenMiddleware,(req, res) => {
    let id = req.params.id
    //插入数据库
    AccountModel.updateOne({_id: id}, req.body)
        .then(data => {
            AccountModel.findById(id).then(data => {
                res.json({
                    code: '0000',
                    msg: 'success',
                    data: data
                })
            }).catch(err => {
                res.json({
                    code: '1004',
                    msg: 'failure',
                    data: null
                })
            })

        }).catch(err => {
        res.json({
            code: '1005',
            msg: 'failure',
            data: null
        })
    })
});


module.exports = router;
