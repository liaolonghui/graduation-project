const express = require('express')
const cors = require('cors')
const path = require('path')
// 端口
const SERVER_PORT = 666
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`

const app = express()
// secret
app.set('secret', 'ayqwysdgyqwidiwqashbgdihdiashdihaid')

app.use(cors()) // cors
app.use(express.json()) // 获取json数据

// 静态资源
app.use('/imgs', express.static(path.join(__dirname + '/imgs')))

// routes
require('./routes/index.js')(app, SERVER_URL)


app.listen(SERVER_PORT, () => {
  console.log(`监听${ SERVER_PORT }端口`)
})