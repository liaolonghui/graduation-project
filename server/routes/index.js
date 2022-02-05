const Goods = require('../models/Goods')

module.exports = (app, SERVER_URL, baseCategories) => {
  const express = require('express')
  const axios = require('axios')
  const jwt = require('jsonwebtoken')
  const multer = require('multer')
  const router = express.Router()

  // models
  const User = require('../models/User')
  const Category = require('../models/Category')

  // 用户搜索  只显示state为true的


  const verifyAdmin = async (req, res, next) => {
    // 获取用户权限，id
    const token = req.headers.authorization
    const {id} = jwt.verify(token, app.get('secret'))
    const user = await User.findById(id)

    req.userId = user._id
    req.power = user.power

    await next()

  }
  // 获取用户列表
  router.get('/getUserList', async (req, res) => {
    let { searchKey='', pageNumber=1, pageSize=10 } = req.query
    pageNumber = parseInt(pageNumber)
    pageSize = parseInt(pageSize)
    
    const skipSum = (pageNumber - 1) * pageSize

    const total = await User.find({
      nickName: {
        $regex: searchKey,
        $options: 'ig'
      }
    }).countDocuments()
    const userList = await User.find({
      nickName: {
        $regex: searchKey,
        $options: 'ig'
      }
    }).skip(skipSum).limit(pageSize)
    
    res.send({
      total,
      userList
    })
  })
  // User  修改权限    只有管理员可以
  router.post('/updatePower', verifyAdmin , async (req, res) => {
    const power = req.power

    if (power !== 'super') return res.send({
      code: 'bad',
      msg: '权限不足'
    })

    const id = req.body.id
    const user = await User.findById(id)
    if (user.accountNumber === 'admin') {
      // admin账号不能被修改权限的
      return res.send({
        code: 'bad',
        msg: '不允许修改该用户的权限'
      })
    }

    const result = await User.findByIdAndUpdate(id, {
      $set: {
        power: user.power === 'super' ? 'none' : 'super'
      }
    })

    res.send({
      code: 'ok',
      result
    })

  })
  // 删号     只有管理员可以    (因为前期设计问题，所以没有弄成封号功能，而是直接删号)
  router.delete('/deleteUser', verifyAdmin, async (req, res) => {
    const power = req.power

    if (power !== 'super') return res.send({
      code: 'bad',
      msg: '权限不足'
    })

    const id = req.body.id
    const result = await User.findByIdAndDelete(id)
    res.send({
      code: 'ok',
      result
    })

  })


  // Goods
  // 商品图片的上传
  const goodsImgUp = multer({ dest: 'goodsImgs/' })
  router.post('/addGoodsImg', goodsImgUp.single('goodsImg'), (req, res) => {
    res.send({
      code: 'ok',
      name: req.file.originalname,
      path: SERVER_URL+'/goodsImgs/'+req.file.filename
    })
  })
  // 添加新商品 （如果是管理员提交的商品就直接通过审核）
  router.post('/addGoods', verifyAdmin, async (req, res) => {
    const sellerId = req.userId // 卖家id （也就是发请求的用户id）
    const power = req.power // 权限
    const goods = req.body

    const result = await Goods.create({
      ...goods,
      seller: sellerId,
      state: power == 'super' // （如果是管理员提交的商品就直接通过）
    })

    res.send({
      code: 'ok',
      result
    })
  })
  // 获取用户自己发布的商品列表
  router.get('/getGoods', verifyAdmin, async (req, res) => {
    const userId = req.userId

    const goodsList = await Goods.find({
      seller: userId
    })

    res.send({
      code: 'ok',
      goodsList
    })
  })
  // 用户自己删除发布的商品
  router.delete('/deleteGoods', verifyAdmin, async (req, res) => {
    const userId = req.userId
    const goodsId = req.body.goodsId

    const goods = await Goods.findOne({
      _id: goodsId,
      seller: userId
    })
    // 如果不存在
    if (!goods) return res.send({
      code: 'bad',
      msg: '您已发布的商品中并无此商品'
    })
    await Goods.findByIdAndDelete(goodsId)
    res.send({
      code: 'ok'
    })
  })
  // 获取商品列表用于管理员查看审核 query有searchKey pageNumber pageSize
  router.get('/getGoodsList', async (req, res) => {

    let { searchKey='', pageNumber=1, pageSize=10 } = req.query
    pageNumber = parseInt(pageNumber)
    pageSize = parseInt(pageSize)
    
    const skipSum = (pageNumber - 1) * pageSize

    const total = await Goods.find({
      name: {
        $regex: searchKey,
        $options: 'ig'
      }
    }).countDocuments()
    const goodsList = await Goods.find({
      name: {
        $regex: searchKey,
        $options: 'ig'
      }
    }).populate('seller category').skip(skipSum).limit(pageSize)
    
    res.send({
      total,
      goodsList
    })

  })
  // 审核商品 （管理员权限）
  router.post('/auditGoods', verifyAdmin, async (req, res) => {
    const power = req.power // 权限
    const { goodsId, state } = req.body

    if (power === 'super') {
      const result = await Goods.findByIdAndUpdate(goodsId, {
        $set: {
          state
        }
      })
      res.send({
        code: 'ok',
        result
      })
    } else {
      res.send({
        code: 'bad',
        msg: '权限不足'
      })
    }
  })


  // 分类页的树形分类列表
  router.get('/getCategoryTree', async (req, res) => {

    // 1
    let categoryTree = await Category.find({
      level: 1
    })
    categoryTree = JSON.parse(JSON.stringify(categoryTree)) // 因为无法对查询结果直接修改，所以拷贝一份（该方式不适用于含有正则，Date等数据）
    // 2
    let category2level = await Category.find({
      level: 2
    })
    category2level = JSON.parse(JSON.stringify(category2level)) // 因为无法对查询结果直接修改，所以拷贝一份（该方式不适用于含有正则，Date等数据）
    // 3
    let category3level = await Category.find({
      level: 3
    })
    // 循环
    for (let i = 0; i < category3level.length; i++) {
      for (let j = 0; j < category2level.length; j++) {
        // 将对应的三级分类push进二级分类的children里面
        if (category3level[i].parent.toString() === category2level[j]._id.toString()) {
          category2level[j]['children'] = category2level[j]['children'] || []
          category2level[j]['children'].push(category3level[i])
          break
        }
      }
    }
    for (let i = 0; i < category2level.length; i++) {
      for (let j = 0; j < categoryTree.length; j++) {
        // 将对应的二级分类push进一级分类的children里面
        if (category2level[i].parent.toString() === categoryTree[j]._id.toString()) {
          categoryTree[j]['children'] = categoryTree[j]['children'] || []
          categoryTree[j]['children'].push(category2level[i])
          break
        }
      }
    }
    
    res.send({
      categoryTree
    })
  })
  // Category  
  // 获取分类列表（可接受 query: { level } 用于获取对应级别的分类）  1<=level<=3
  router.get('/getCategory', async (req, res) => {
    const { level } = req.query

    let result = []
    if (level>=1 && level<=3) {
      result = await Category.find({
        level
      })
    } else {
      result = await Category.find()
    }
    
    res.send({
      code: 'ok',
      categories: result
    })
  })
  // 分类图标的上传
  const categoryImgUp = multer({ dest: 'categoryImgs/' })
  router.post('/addcategoryImg', categoryImgUp.single('categoryImg'), (req, res) => {
    res.send({
      code: 'ok',
      name: req.file.originalname,
      path: SERVER_URL+'/categoryImgs/'+req.file.filename
    })
  })
  router.post('/addCategory', async (req, res) => {
    const category = req.body

    // 如果有重名就不创建
    const cate = await Category.findOne({
      name: category.name
    })
    if (cate) {
      return res.send({
        code: 'bad',
        msg: '已存在同名分类'
      })
    }
    
    const result = await Category.create(category)

    if (!result) return res.send({
      code: 'bad'
    })

    res.send({
      code: 'ok'
    })
  })
  router.put('/updateCategory', async (req, res) => {
    const { id, newCategory } = req.body

    // baseCategories就不修改
    const category = await Category.findById(id)
    for (let i = 0; i < baseCategories.length; i++) {
      if (baseCategories[i] === category.name) {
        return res.send({
          code: 'bad',
          msg: '该分类不允许修改'
        })
      }
    }

    await Category.findByIdAndUpdate(id, newCategory)
    res.send({
      code: 'ok'
    })
  })
  router.delete('/deleteCategory/:id', async (req, res) => {

    const category = await Category.findById(req.params.id)
    for (let i = 0; i < baseCategories.length; i++) {
      if (baseCategories[i] === category.name) {
        return res.send({
          code: 'bad',
          msg: '该分类不允许删除'
        })
      }
    }

    await Category.findByIdAndDelete(req.params.id)
    res.send({
      code: 'ok'
    })
  })


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

  // login
  router.post('/login', async (req, res) => {
    const newU = req.body
    const oldU = await User.findOne({
      accountNumber: newU.accountNumber
    }).select('+password')

    if (!oldU || !require('bcrypt').compareSync(newU.password, oldU.password)) {
      res.send({
        code: 'bad',
        msg: '登录失败'
      })
    } else {
      // 得到token
      const token = jwt.sign({ id: oldU._id }, app.get('secret'))
      // console.log(jwt.verify(token, app.get('secret')))
      
      res.send({
        code: 'ok',
        token
      })
    }
  })
  // 获取用户信息
  router.get('/getUserInfo', async (req, res) => {
    const token = req.headers.authorization
    const {id} = jwt.verify(token, app.get('secret'))
    const user = await User.findById(id)

    res.send({
      code: 'ok',
      avatar: user.avatar,
      nickName: user.nickName,
      power: user.power, // 权限
    })
  })
  // 头像的上传
  const avatarUp = multer({ dest: 'avatars/' })
  router.post('/uploadAvatar', avatarUp.single('avatar'), (req, res) => {
    res.send({
      code: 'ok',
      name: req.file.originalname,
      path: SERVER_URL+'/avatars/'+req.file.filename
    })
  })
  // register
  router.post('/register', async (req, res) => {
    const user = {
      ...req.body,
      power: 'none'
    }
    const u = await User.findOne({
      accountNumber: req.body.accountNumber
    })
    if (u) {
      return res.send({
        code: 'bad',
        msg: '该账号已被人注册'
      })
    }
    const result = await User.create(user)
    if (result) {
      res.send({
        code: 'ok'
      })
    } else {
      res.send({
        code: 'bad',
        msg: '注册失败，请重试！'
      })
    }
  })

  // bindWX 账号绑定微信 (待完成)
  router.post('/bindWX', async (req, res) => {
    const code = req.body.code
    const appid = 'wx580203372bb581d1'
    const appsecret = '41969af8489bbb4ff1e00ef8dd5fcc4a'
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`
    
    const result = await axios.get(url)
    const userInfo = {
      session_key: result.data.session_key,
      openid: result.data.openid
    }

    res.send({
      isok: '成功'
    })
  })


  app.use('/api', router)
} 