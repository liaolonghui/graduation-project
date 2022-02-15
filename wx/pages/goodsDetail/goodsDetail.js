import { request } from "../../request/index"

// pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userFavorites: [],
    goods: {},
    showAllCommentsBool: false,
    countModalBool: false,
    count: 1,
  },

  showAllComments () {
    if (this.data.goods.comments.length <= 1) return
    this.setData({
      showAllCommentsBool: !this.data.showAllCommentsBool
    })
  },

  // 显示选中数量的对话框
  showCountModal () {
    // 如果用户没有登录就提示用户登录并跳转（这里用token判断）
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '请在登录后操作',
        icon: 'none'
      })
      return
    }
    this.setData({
      countModalBool: true
    })
  },
  hideCountModal () {
    this.setData({
      countModalBool: false
    })
  },

  // 改变count
  changeCount (e) {
    const count = this.data.count
    const amount = this.data.goods.amount
    switch (e.target.dataset.o) {
      case '-':
        if (count <= 1) return
        this.setData({
          count: this.data.count - 1
        })
        break;
      case '+':
        if (count >= amount) return
        this.setData({
          count: this.data.count + 1
        })
        break;
      default:
        break;
    }
  },

  // 禁止用户滑动
  stopTouch (e) {
    return
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoods(options.goodsId)
  },

  // 加入购物车
  async addCart () {
    const token = wx.getStorageSync('token')
    const goodsId = this.data.goods._id
    const count = this.data.count
    const result = await request('addCart', {
      goodsId,
      count
    }, 'post', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      wx.showToast({
        title: '添加购物车成功',
        icon: 'none'
      })
      this.setData({
        countModalBool: false,
        count: 1
      })
    }
  },
  // 购买 先生成订单然后跳转到订单详情页
  async buy () {

  },

  async getFavorites () {
    const token = wx.getStorageSync('token')
    const result = await request('getFavorites', {}, 'get', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.setData({
        userFavorites: result.data.favorites
      })
    }
  },

  async getGoods (goodsId) {
    const result = await request('getGoodsDetail', {
      goodsId
    })
    if (result.data.code === 'ok') {
      // html要转换一下
      // &lt;转<  &gt;转>
      result.data.goods.html = result.data.goods.html.replace(/&lt;/g, '<')
      result.data.goods.html = result.data.goods.html.replace(/&gt;/g, '>')
      result.data.goods.html = result.data.goods.html.replace(/<img/g, '<img style="width: 100% !important;"')
      this.setData({
        goods: result.data.goods
      })
    }
  },

  // 添加或删除收藏
  async ChangeFavorites () {
    // 如果用户没有登录就提示用户登录并跳转（这里用token判断）
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '请在登录后操作',
        icon: 'none'
      })
      return
    }
    const goodsId = this.data.goods._id
    const result = await request('collect', {
      goodsId
    }, 'post', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.setData({
        userFavorites: result.data.favorites
      })
    }
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
    this.getFavorites()
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