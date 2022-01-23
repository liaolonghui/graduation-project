import { request } from "../../request/index"

// pages/goodsRelease/goodsRelease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [] // 用户发布的商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getGoodsList()
  },

  // 获取goodsList
  async getGoodsList () {
    const token = wx.getStorageSync('token')
    const res = await request('getGoods', {}, 'get', {
      authorization: token
    })

    if (res.data.code == 'ok') {
      this.setData({
        goodsList: res.data.goodsList
      })
    }
  },

  // 去添加商品的页面
  toAddGoods () {
    wx.navigateTo({
      url: '../goodsAdd/goodsAdd',
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
    this.getGoodsList()
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