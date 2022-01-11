module.exports = (app, SERVER_URL) => {
  const express = require('express')
  const router = express.Router()

  // 返回swiperList
  router.get('/getSwiperList', (req, res, next) => {
    res.send({
      swiperList: [
        {
          area_id: 111,
          img_src: `${SERVER_URL}/imgs/nav/nav1.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=年货'
        },
        {
          area_id: 222,
          img_src: `${SERVER_URL}/imgs/nav/nav2.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=甘肃'
        },
        {
          area_id: 333,
          img_src: `${SERVER_URL}/imgs/nav/nav3.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=湖北'
        },
        {
          area_id: 444,
          img_src: `${SERVER_URL}/imgs/nav/nav4.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=四川'
        },
        {
          area_id: 555,
          img_src: `${SERVER_URL}/imgs/nav/nav5.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=新疆'
        },
      ]
    })
  })

  app.use('/api', router)
} 