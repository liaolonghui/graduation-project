import { request } from "../../request/index"

// pages/userFavorites/userFavorites.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favorites: []
  },

  toGoodsDetail (e) {
    const goodsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  async getFavorites () {
    const token = wx.getStorageSync('token')
    const result = await request('getFavorites', {
      detail: true
    }, 'get', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.setData({
        favorites: result.data.favorites
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