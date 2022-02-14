const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
  avatar: { type: String },
  nickName: { type: String },
  accountNumber: { type: String },
  password: {
    type: String,
    select: false,
    set (val) {
      return bcrypt.hashSync(val, 10)
    }
  },
  power: { type: String }, // 如果是super就是管理员，none就是普通用户
  cart: [{ // 购物车
    goods: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Goods'
    },
    count: { type: Number }
  }],
  favorites: [{ // 收藏夹
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Goods'
  }],
  defaultAddress: { // 默认地址
    type: String, 
  }
})

module.exports = mongoose.model('User', schema)