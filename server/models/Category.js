const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  level: { // 用于表示该分类是哪一级的（如A是第一级则没有父级分类，如果A是第三级则其父分类是第二级的）
    type: Number
  },
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category'
  },
  name: {
    type: String
  }
})

module.exports = mongoose.model('Category', schema)