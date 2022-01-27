const express = require('express')
const cors = require('cors')
const path = require('path')

const User = require('./models/User')
const Category = require('./models/Category')

// 端口
const SERVER_PORT = 666
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`
// 基本一级分类
const baseCategories = ['米面粮油', '肉禽蛋奶', '时令果蔬', '休闲零食', '茗茶饮品']

const app = express()
// secret
app.set('secret', 'ayqwysdgyqwidiwqashbgdihdiashdihaid')

app.use(cors()) // cors
app.use(express.json()) // 获取json数据

// 数据库
require('./plugins/db')(app)

// 静态资源
app.use('/imgs', express.static(path.join(__dirname + '/imgs')))
app.use('/avatars', express.static(path.join(__dirname + '/avatars'))) // 头像
app.use('/categoryImgs', express.static(path.join(__dirname + '/categoryImgs'))) // 分类图标
app.use('/goodsImgs', express.static(path.join(__dirname + '/goodsImgs'))) // 商品图片

// routes
require('./routes/index.js')(app, SERVER_URL, baseCategories)



// 自动创建admin管理员
User.findOne({
  accountNumber: 'admin'
}).then(user => {
  if (!user) {
    User.create({
      nickName: '廖龙辉',
      accountNumber: 'admin',
      password: 'admin',
      power: 'super'
    })
  }
})
// 基本的一级分类
baseCategories.forEach((categoryName, index) => {
  index++
  Category.findOne({
    level: 1,
    name: categoryName
  }).then(category => {
    if (!category) {
      Category.create({
        name: categoryName,
        level: 1,
        img: SERVER_URL + '/imgs/navBar/' + index + '.png'
      })
    }
  })
});


app.listen(SERVER_PORT, () => {
  console.log(`监听${ SERVER_PORT }端口`)
})