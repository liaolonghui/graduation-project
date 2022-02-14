import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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