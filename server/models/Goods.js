const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  seller: { // 卖方
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  name: {
    type: String
  },
  area: { // 地区
    type: String
  },
  category: { // 所属分类（只能是三级分类）
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category'
  },
  imgs: [ // 商品的图片
    {
      type: String
    }
  ],
  price: { type: Number }, // 价格 （原价）
  nowPrice: { type: Number }, // 现价
  amount: { type: Number }, // 货存数量
  sale: { type: Number }, // 已出售量
  tele: { type: Number }, // 售后电话
  comments: [ // 评论
    {
      name: String,
      score: Number, // 得分 1-5
      time: String, // 评价发布时间
      content: String,
    }
  ]
})

module.exports = mongoose.model('Goods', schema)