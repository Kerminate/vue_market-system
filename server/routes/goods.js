// routes里是二级路由，app.js里定义了一级路由
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/pro1', {
  useMongoClient: true
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success.')
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail.')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected.')
})

router.get('/list', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}

  if (priceLevel !== '-1') {
    switch (priceLevel) {
      case '0': priceGt = 0
        priceLte = 100
        break
      case '1': priceGt = 100
        priceLte = 500
        break
      case '2': priceGt = 500
        priceLte = 1000
        break
      case '3': priceGt = 1000
        priceLte = 5000
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', (req, res, next) => {
  var userId = '100000077'
  var productId = req.body.productId
  var User = require('../models/user')

  User.findOne({userId: userId}, (err1, userDoc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      })
    } else {
      // console.log(`userDoc:${userDoc}`)
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach((item) => {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save((err3, doc2) => {
            if (err3) {
              res.json({
                status: '1',
                msg: err3.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, (err2, doc) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              if (doc) {
                doc.productNum = 1
                doc.checked = 1
                userDoc.cartList.push(doc)
                userDoc.save((err3, doc2) => {
                  if (err3) {
                    res.json({
                      status: '1',
                      msg: err3.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
