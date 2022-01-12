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

  // 返回navBarList
  router.get('/getNavBarList', (req, res, next) => {
    res.send({
      navBarList: [
        {
          type_id: 001,
          img_src: `${SERVER_URL}/imgs/navBar/1.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?type=米面粮油'
        },
        {
          type_id: 002,
          img_src: `${SERVER_URL}/imgs/navBar/2.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?type=肉禽蛋奶'
        },
        {
          type_id: 003,
          img_src: `${SERVER_URL}/imgs/navBar/3.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?type=时令果蔬'
        },
        {
          type_id: 004,
          img_src: `${SERVER_URL}/imgs/navBar/4.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?type=休闲零食'
        },
        {
          type_id: 005,
          img_src: `${SERVER_URL}/imgs/navBar/5.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?type=茗茶饮品'
        },
      ]
    })
  })

  // 返回recommend 
  router.get('/getRecommend', (req, res) => {
    res.send({
      recommend: [
        {
          goods_id: 55555,
          recommend_img: `${SERVER_URL}/imgs/recommend/1.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/goodsDetail/goodsDetail?goodsId=55555'
        },
        {
          goods_id: 666666,
          recommend_img: `${SERVER_URL}/imgs/recommend/2.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/goodsDetail/goodsDetail?goodsId=66666'
        }
      ]
    })
  })

  // 返回areaBarList
  router.get('/getAreaBarList', (req, res, next) => {
    res.send({
      areaBarTitleImg: `${SERVER_URL}/imgs/area/title.png`,
      areaBarList: [
        {
          area_id: 01,
          img_src: `${SERVER_URL}/imgs/area/hubei.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=湖北'
        },
        {
          area_id: 02,
          img_src: `${SERVER_URL}/imgs/area/shanxi.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=陕西'
        },
        {
          area_id: 03,
          img_src: `${SERVER_URL}/imgs/area/jiangxi.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=江西'
        },
        {
          area_id: 04,
          img_src: `${SERVER_URL}/imgs/area/gansu.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=甘肃'
        },
        {
          area_id: 05,
          img_src: `${SERVER_URL}/imgs/area/sichuan.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=四川'
        },
        {
          area_id: 06,
          img_src: `${SERVER_URL}/imgs/area/yunnan.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=云南'
        },
        {
          area_id: 07,
          img_src: `${SERVER_URL}/imgs/area/guangxi.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=广西'
        },
        {
          area_id: 08,
          img_src: `${SERVER_URL}/imgs/area/ningxia.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=宁夏'
        },
        {
          area_id: 09,
          img_src: `${SERVER_URL}/imgs/area/xinjiang.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=新疆'
        },
        {
          area_id: 10,
          img_src: `${SERVER_URL}/imgs/area/henan.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=河南'
        },
        {
          area_id: 11,
          img_src: `${SERVER_URL}/imgs/area/hebei.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=河北'
        },
        {
          area_id: 12,
          img_src: `${SERVER_URL}/imgs/area/heilongjiang.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=黑龙江'
        },
        {
          area_id: 13,
          img_src: `${SERVER_URL}/imgs/area/qinghai.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=青海'
        },
        {
          area_id: 14,
          img_src: `${SERVER_URL}/imgs/area/jilin.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=吉林'
        },
        {
          area_id: 15,
          img_src: `${SERVER_URL}/imgs/area/guizhou.png`,
          open_type: 'navigate',
          navigator_url: '/pages/search/search?area=贵州'
        },
      ]
    })
  })

  app.use('/api', router)
} 