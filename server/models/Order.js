// 订单模型  (设计为一个订单只有一种货物，但可以买多个)
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  seller: { // 卖方
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  buyer: {  // 买方
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  state: { // 状态
    type: String // 有四种状态：待付款，待收货，待评价，已评价
  },
  goods: { // 商品
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Goods'
  },
  count: { type: Number }, // 数量
  price: { type: Number }, // 价格（当前购买时的价格）
  freight: {type: Number}, // 运费
  to: { type: String }, // 地址
})

module.exports = mongoose.model('Order', schema)