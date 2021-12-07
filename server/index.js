const express = require('express')
const cors = require('cors')
// 端口
const SERVER_PORT = 666

const app = express()


app.use(cors()) // cors
app.use(express.json()) // 获取json数据


// router
const router = express.Router()
router.get('*', (req, res, next) => {
  console.log(req.url)
  res.send('你访问的路径是' + req.url)
})
app.use(router)


app.listen(SERVER_PORT, () => {
  console.log(`监听${ SERVER_PORT }端口`)
})