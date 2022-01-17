const express = require('express')
const cors = require('cors')
const path = require('path')

const User = require('./models/User')

// 端口
const SERVER_PORT = 666
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`

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

// routes
require('./routes/index.js')(app, SERVER_URL)



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


app.listen(SERVER_PORT, () => {
  console.log(`监听${ SERVER_PORT }端口`)
})