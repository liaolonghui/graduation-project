import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: [], // 购物车商品
    selectGoods: [], // 选中的商品
  },

  // 选中某商品
  selectGoods (e) {
    const index = e.target.dataset.index
    const { cartData, selectGoods } = this.data
    // 判断是否已在selectGoods中
    const goodsIndex = selectGoods.findIndex((goods) => {
      return goods.goods._id === cartData[index].goods._id
    })
    if (goodsIndex > -1) {
      selectGoods.splice(goodsIndex, 1)
      this.setData({
        selectGoods
      })
    } else {
      selectGoods.push(JSON.parse(JSON.stringify(cartData[index])))
      this.setData({
        selectGoods
      })
    }
  },

  // 全选
  selectAll () {
    const { cartData, selectGoods } = this.data
    // console.log(cartData.length === selectGoods.length)
    if (cartData.length === selectGoods.length) {
      this.setData({
        selectGoods: []
      })
    } else {
      this.setData({
        selectGoods: JSON.parse(JSON.stringify(cartData))
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // buy商品 先生成订单然后跳转到订单详情页
  async buy () {
    const { selectGoods } = this.data
    if (!selectGoods.length) return wx.showToast({
      title: '请选中商品后再结算',
      icon: 'none'
    })
    const goodsArr = selectGoods.map(goodsInfo => {
      return {
        goods: goodsInfo.goods._id,
        count: goodsInfo.count
      }
    })
    const token = wx.getStorageSync('token')
    const result = await request('createOrder', {
      goodsArr
    }, 'post', {
      authorization: token
    })
    // 订单生成后把购物车内对应的商品移除
    if (result.data.code === 'ok') {
      const goodsIdArr = selectGoods.map(goods => goods.goods._id)
      await request('deleteCart', {
        goodsArr: goodsIdArr
      }, 'delete', {
        authorization: token
      })
      this.setData({
        selectGoods: []
      })
      wx.navigateTo({
        url: '../userOrderDetail/userOrderDetail?orderId=' + result.data.orderId,
      })
    }
  },

  // 删除商品
  delete () {
    const { selectGoods } = this.data
    if (!selectGoods.length) return wx.showToast({
      title: '请选中商品后再删除',
      icon: 'none'
    })
    const goodsArr = selectGoods.map(goods => goods.goods._id)
    const that = this
    wx.showModal({
      title: '移除商品',
      content: `是否从购物车中移除选中的商品`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          // 确定
          const token = wx.getStorageSync('token')
          const result = await request('deleteCart', {
            goodsArr
          }, 'delete', {
            authorization: token
          })
          if (result.data.code === 'ok') {
            that.getCart()
            wx.showToast({
              title: '商品移除成功',
              icon: 'none'
            })
            that.setData({
              selectGoods: []
            })
          }
        } else if (res.cancel) {
          // 用户点击取消
        }
      }
    })
  },

  // 改变购物车商品数量
  async changeGoodsCount (e) {
    let { amount, count, id: goodsId } = e.currentTarget.dataset // 库存  数量  商品id
    const operation = e.target.dataset.o // 减少还是增加
    if (operation === '-') {
      count--
    } else if (operation === '+') {
      count++
    }
    // 如果count 小于1 或者 大于库存 就不发请求
    if (count < 1 && count > amount) {
      return
    }
    const token = wx.getStorageSync('token')
    const result = await request('changeGoodsCount', {
      goodsId,
      count
    }, 'post', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.getCart()
    }
  },

  // 获取购物车信息
  async getCart () {
    const token = wx.getStorageSync('token')
    const result = await request('getCart', {}, 'get', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.setData({
        cartData: result.data.cart
      })
    }
  },

  // 去首页
  toIndex () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '请在登录后查看购物车',
        icon: 'none'
      })
      return 
    }
    this.getCart()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})