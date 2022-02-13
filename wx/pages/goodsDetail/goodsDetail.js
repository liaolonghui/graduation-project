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
  },

  showAllComments () {
    if (!this.data.goods.comments.length) return
    this.setData({
      showAllCommentsBool: !this.data.showAllCommentsBool
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoods(options.goodsId)
    this.getFavorites()
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
    const goodsId = this.data.goods._id
    const token = wx.getStorageSync('token')
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