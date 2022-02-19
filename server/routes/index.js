module.exports = (app, SERVER_URL, baseCategories) => {
  const express = require('express')
  const axios = require('axios')
  const jwt = require('jsonwebtoken')
  const multer = require('multer')
  const router = express.Router()

  // models
  const User = require('../models/User')
  const Category = require('../models/Category')
  const Goods = require('../models/Goods')
  const Order = require('../models/Order')
  

  const verifyAdmin = async (req, res, next) => {
    // 获取用户权限，id，cart
    const token = req.headers.authorization
    if (!token) {
      return res.send({
        code: 'bad',
        msg: '请在登录后操作'
      })
    }
    const {id} = jwt.verify(token, app.get('secret'))
    const user = await User.findById(id)

    req.userId = user._id // id
    req.power = user.power // 权限
    req.cart = user.cart || [] // 购物车
    req.favorites = user.favorites || [] // 收藏
    req.name = user.nickName
    req.to = user.defaultTo || ''

    await next()

  }


  // 获取商品详情
  router.get('/getGoodsDetail', async (req, res) => {
    const goodsId = req.query.goodsId
    const goods = await Goods.findById(goodsId).populate('category', 'name')

    res.send({
      code: 'ok',
      goods
    })
    
  })
  // 获取用户收藏
  router.get('/getFavorites', verifyAdmin, async (req, res) => {
    let favorites = null
    const { detail } = req.query // 如果是要获取更详细的信息
    if (detail) {
      const user = await User.findById(req.userId).populate({
        path: 'favorites',
        populate: {
          path: 'category'
        }
      })
      favorites = user.favorites
    } else {
      favorites = req.favorites
    }

    res.send({
      code: 'ok',
      favorites
    })
  })
  // 用户收藏或取消收藏某个商品
  router.post('/collect', verifyAdmin, async (req, res) => {
    const id = req.userId
    let oldFavorites = req.favorites
    const goodsId = req.body.goodsId

    if (!goodsId) return res.send({
      code: 'bad',
      msg: '请传递要收藏的商品id'
    })

    // 如果已存在就删除，不存在就收藏
    const index = oldFavorites.indexOf(goodsId)
    if (index > -1) {
      // 有
      oldFavorites.splice(index, 1)
    } else {
      // 无
      oldFavorites = oldFavorites.concat(goodsId)
    }

    await User.findByIdAndUpdate(id, {
      $set: {
        favorites: oldFavorites
      }
    })
    const {favorites} = await User.findById(id) || []

    res.send({
      code: 'ok',
      favorites
    })

  })

  // 获取用户购物车信息
  router.get('/getCart', verifyAdmin, async (req, res) => {
    const id = req.userId
    const { cart } = await User.findById(id).populate({
      path: 'cart.goods',
      select: 'name nowPrice imgs amount'
    }) || []

    res.send({
      code: 'ok',
      cart
    })
  })
  // 添加到购物车
  router.post('/addCart', verifyAdmin, async (req, res) => {
    const id = req.userId
    let cart = req.cart
    const { goodsId, count } = req.body

    // 如果是已存在的货物则在原先基础上增加数量
    let flag = false
    cart = cart.map(c => {
      if (c.goods.toString() === goodsId) {
        flag = true
        c.count += count
      }
      return c
    })


    const result = await User.findByIdAndUpdate(id, {
      $set: {
        cart: flag ? cart : cart.concat({ goods: goodsId, count })
      }
    })
    res.send({
      code: 'ok',
      result
    })

  })
  // 从购物车中移除
  router.delete('/deleteCart', verifyAdmin, async (req, res) => {
    let cart = req.cart
    const goodsArr = req.body.goodsArr
    // 传入的 goodsArr 是一个goodsId数组，删除多个
    for (let i = 0; i < goodsArr.length; i++) {
      for (let j = 0; j < cart.length; j++) {
        if (cart[j].goods.toString() === goodsArr[i]) {
          cart.splice(j, 1)
          j--
        }
      }
    }
    const result = await User.findByIdAndUpdate(req.userId, {
      $set: {
        cart
      }
    })
    res.send({
      code: 'ok',
      result
    })
  })
  // 改变购物车某商品的数量
  router.post('/changeGoodsCount', verifyAdmin, async (req, res) => {
    const {goodsId, count} = req.body

    if (count < 1) return res.send({
      code: 'bad',
      msg: '商品数量不能小于1'
    })

    const userId = req.userId
    let cart = req.cart

    cart = cart.map(c => {
      if (c.goods.toString() === goodsId) {
        c.count = count
      }
      return c
    })

    const result = await User.findByIdAndUpdate(userId, {
      $set: {
        cart
      }
    })

    res.send({
      code: 'ok',
      result
    })

  })
  // 生成订单    初始state为待付款
  router.post('/createOrder', verifyAdmin, async (req, res) => {
    // 接收 [{ goods: 商品id, count: 数量 }] 数组
    // 通过商品id获取到：nowPrice，seller
    // to: 地址需要使用user的defaultTo，如果没有则先不设置，在用户支付时再要求用户设置自己的defaultTo（支付时也支持用户修改）
    
    const buyer = req.userId // buyer
    const to = req.to // to
    const state = '待付款' // 初始订单状态

    const goodsArr = req.body.goodsArr

    let orderArr = [] // 订单的所有商品

    for (let i = 0; i < goodsArr.length; i++) {

      const goodsInfo = await Goods.findById(goodsArr[i].goods)
      const seller = goodsInfo.seller
      const goods = goodsInfo._id
      const count = goodsArr[i].count
      const price = goodsInfo.nowPrice
      const totalPrice = price * count

      // 生成订单
      const result = await Order.create({
        buyer,
        seller,
        goods,
        price,
        count,
        totalPrice,
        to,
        state,
      })
      if (result) {
        orderArr.push(result._id)
      }

    }

    res.send({
      code: 'ok',
      orderArr
    })

  })
  // 用户查看自己的所有订单  type参数是 seller 则是返回商家订单
  router.get('/getOrderList', verifyAdmin, async (req, res) => {

    const type = req.query.type
    const userId = req.userId

    let searchObj = {}
    // type参数是 seller 则是返回商家订单  不返回‘待付款’和‘已取消’
    if (type === 'seller') {
      searchObj.seller = userId
      searchObj.state = {
        $not: /^(待付款|已取消)$/
      }
    } else {
      searchObj.buyer = userId
    }

    const orders = await Order.find(searchObj).populate('goods').sort({ _id: -1 })

    res.send({
      code: 'ok',
      orders
    })

  })
  // 用户或商家查看自己的订单详情  参数orderArr（即可传入多个orderId）
  router.post('/getOrderDetail', verifyAdmin, async (req, res) => {
    const userId = req.userId
    const orderArr = req.body.orderArr
    
    // 订单数组
    let orders = []
    // 是否是买家
    let isBuyer = false
    for (let i = 0; i < orderArr.length; i++) {
      const order = await Order.findById(orderArr[i]).populate('goods')
      if (order.buyer.toString() === userId.toString()) {
        // 是否是买家
        isBuyer = true
      }
      if (order && (order.buyer.toString() === userId.toString() || order.seller.toString() === userId.toString())) {
        // 只有订单的卖家买家能查看
        orders.push(order)
      }
    }

    res.send({
      code: 'ok',
      orders,
      isBuyer
    })

  })
  // 用户设置自己的defaultTo（传to）   如果传入了ordersId就顺便把对应所有order的to修改
  router.post('/changeTo', verifyAdmin, async (req, res) => {
    const userId = req.userId
    const { to, ordersId } = req.body

    await User.findByIdAndUpdate(userId, {
      $set: {
        defaultTo: to
      }
    })

    if (ordersId && ordersId !== 'undefined') {
      for (let i = 0; i < ordersId.length; i++) {
        const orderId = ordersId[i];
        await Order.findByIdAndUpdate(orderId, {
          $set: {
            to
          }
        }) 
      }
    }

    res.send({
      code: 'ok'
    })

  })

  // 订单state相关的各种操作
  // 只有在订单支付之前才能取消订单   state改为已取消
  router.post('/cancel', verifyAdmin, async (req, res) => {
    const userId = req.userId
    const { orderId } = req.body // 订单id
    const state = '已取消'

    const order = await Order.findById(orderId)
    if (order.state !== '待付款') {
      return res.send({
        code: 'bad',
        msg: '订单已支付,无法取消'
      })
    }
    // 这里设置为只有订单的购买者才能取消
    if (order.buyer.toString() === userId.toString()) {
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          state
        }
      })
      res.send({
        code: 'ok',
        msg: '订单取消成功'
      })
    } else {
      res.send({
        code: 'bad',
        msg: '必须本人账号才能取消'
      })
    }
  })
  // 支付后      state改为待发货
  router.post('/pay', verifyAdmin, async (req, res) => {
    const userId = req.userId // 这里只是模拟支付，只是修改了字段没有真实支付
    const { orderId } = req.body // 订单id
    const state = '待发货'

    const order = await Order.findById(orderId)
    if (order.state !== '待付款') {
      return res.send({
        code: 'bad',
        msg: '订单已取消或已支付'
      })
    }
    if (order && order.to && order.to.address) {
      // 这里设置为订单必须有to（即收货地址）才行
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          state
        }
      })
      // 支付后给对应商品修改amount sale
      const goods = await Goods.findById(order.goods)
      const amount = parseInt(goods.amount || 0) - parseInt(order.count)
      const sale = parseInt(goods.sale || 0) + parseInt(order.count)
      await Goods.findByIdAndUpdate(order.goods, {
        $set: {
          amount,
          sale
        }
      })
      res.send({
        code: 'ok',
        msg: '支付成功'
      })
    } else {
      res.send({
        code: 'bad',
        msg: '收货地址未填写'
      })
    }
  })
  // 商家发货后 （需要商家提供快递单号）  state改为待收货
  router.post('/delivery', verifyAdmin, async (req, res) => {
    const state = '待收货'
    const { trackingNumber, orderId } = req.body

    const result = await Order.findByIdAndUpdate(orderId, {
      $set: {
        state,
        trackingNumber
      }
    })

    res.send({
      code: 'ok',
      result
    })

  })
  // 收货后      state改为待评价
  router.post('/takeOver', verifyAdmin, async (req, res) => {
    const state = '待评价'
    const orderId = req.body.orderId

    const result = await Order.findByIdAndUpdate(orderId, {
      $set: {
        state
      }
    })

    res.send({
      code: 'ok',
      msg: '收货成功'
    })
  })
  // 对商品评价（只有购买过并且已收货才能评价）评价后将对应的订单state改为已评价
  router.post('/appraise', verifyAdmin, async (req, res) => {
    // 评论的结构 { name: String, time: timestamp, content: String }
    const state = '已评价'
    const name = req.name
    const { orderId, content } = req.body
    const time = new Date().getTime()
    
    // comment
    const comment = {
      name,
      time,
      content
    }

    const order = await Order.findById(orderId) // 订单
    await Order.findByIdAndUpdate(order, {
      $set: {
        state
      }
    })
    const goods = await Goods.findById(order.goods)
    await Goods.findByIdAndUpdate(order.goods, {
      $set: {
        comments: [comment].concat(goods.comments)
      }
    })

    res.send({
      code: 'ok',
      msg: '评价成功'
    })

  })


  // 用户搜索商品  只显示state为true的
  router.get('/searchGoods', async (req, res) => {

    let { categoryName, area, order, searchKey, pageSize=10, pageNumber=1 } = req.query // 分类名 地区 搜索关键字  以及排序方式（收藏数，销售量，价格）

    // 如果选中的分类是baseCategories里面的则要获取到 其孙级分类 (还有问题，还未实现传入基本分类 搜素的功能)
    let flag = false
    baseCategories.forEach(category => {
      if (category === categoryName) {
        flag = true
      }
    });
    const category = await Category.findOne({name: categoryName})

    // 计算获取哪部分数据
    pageNumber = parseInt(pageNumber)
    pageSize = parseInt(pageSize)
    const skipSum = (pageNumber - 1) * pageSize

    // 搜索对象
    let searchObj = {
      name: {
        $regex: searchKey,
        $options: 'ig'
      },
      state: true
    }
    if (area && area !== 'undefined' && area !== '不限制') {
      searchObj.area = area
    }

    // 如果不是基本分类的，就直接查找其category相同的
    // matchObj 用于populate
    let matchObj = null
    if (category) {
      if (!flag) {
        searchObj.category = category._id
      } else {

        // 是
        matchObj = { parent: category._id }

      }
    }

    // 排序方式
    let orderObj = null
    switch (order) {
      case '销量最高':
        orderObj = { sale: -1 }
        break;
      case '销量最低':
        orderObj = { sale: 1 }
        break;
      case '价格最高':
        orderObj = { nowPrice: -1 }
        break;
      case '价格最低':
        orderObj = { nowPrice: 1 }
        break;
      default:
        break;
    }

    // 如果是基本分类就直接全返回，不做下拉加载
    if (flag) {
      let goodsList = await Goods.find(searchObj).populate({
        path: 'category',
        select: 'name parent',
        populate: {
          path: 'parent',
          match: matchObj,
          select: 'parent',
          options: {}
        }
      }).sort(orderObj)
      goodsList = goodsList.filter(goods => goods.category.parent)

      res.send({
        code: 'ok',
        total: goodsList.length,
        goodsList
      })
      return
    }

    const total = await Goods.find(searchObj).countDocuments()
    const goodsList = await Goods.find(searchObj).populate('category','name').skip(skipSum).limit(pageSize).sort(orderObj)

    res.send({
      code: 'ok',
      total,
      goodsList
    })

  })


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
  // 删号     只有管理员可以 （admin用户不允许删除）    (因为前期设计问题，所以没有弄成封号功能，而是直接删号)
  router.delete('/deleteUser', verifyAdmin, async (req, res) => {
    const power = req.power

    if (power !== 'super') return res.send({
      code: 'bad',
      msg: '权限不足'
    })

    const id = req.body.id
    const user = await User.findById(id)
    if (user.accountNumber === 'admin') {
      // admin不能删
      return res.send({
        code: 'bad',
        msg: '该用户不允许删除'
      })
    }

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
          goods_id: '6207bf4415ffbaaff8677450',
          recommend_img: `${SERVER_URL}/imgs/recommend/1.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/goodsDetail/goodsDetail?goodsId=6207bf4415ffbaaff8677450'
        },
        {
          goods_id: '6207c01f15ffbaaff867749c',
          recommend_img: `${SERVER_URL}/imgs/recommend/2.jpg`,
          open_type: 'navigate',
          navigator_url: '/pages/goodsDetail/goodsDetail?goodsId=6207c01f15ffbaaff867749c'
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