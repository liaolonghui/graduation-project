// 订单模型 
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  buyer: {  // 买方
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  goodsBox: [ // 一个订单可以有多个商品
    {
      goods: { // 商品
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Goods'
      },
      count: { type: Number }, // 数量
      price: { type: Number }, // 单价（购买时的价格）
    }
  ],
  state: { // 订单状态
    type: String // 有四种状态：待付款，待收货，待评价，已评价
  },
  totalPrice: { type: Number }, // 价格（购买时的总价格）
  freight: {type: Number}, // 运费
  to: { type: String }, // 地址
})

module.exports = mongoose.model('Order', schema)