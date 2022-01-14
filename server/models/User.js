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
})

module.exports = mongoose.model('User', schema)