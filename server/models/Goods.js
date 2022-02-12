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
      img_id: String,
      img_url: String
    }
  ],
  html: { // 详细介绍
    type: String
  },
  price: { type: Number }, // 价格 （原价）
  nowPrice: { type: Number }, // 现价
  amount: { type: Number }, // 货存数量
  sale: { type: Number }, // 已出售量
  freight: {type: Number}, // 运费
  tele: { type: Number }, // 售后电话
  comments: [ // 评论
    {
      name: String,
      time: String, // 评价发布时间
      content: String,
    }
  ],
  state: { // 商品是否通过审核  （如果是管理员提交的商品就直接通过）
    type: Boolean
  }
})

module.exports = mongoose.model('Goods', schema)