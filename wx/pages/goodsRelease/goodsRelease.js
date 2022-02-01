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

  // 前往商品详情
  toGoodsDetail (e) {
    const goodsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
  },

  // 删除商品
  async deleteGoods (e) {

    const token = wx.getStorageSync('token')
    const goodsId = e.target.dataset.id
    const name = e.target.dataset.name

    const that = this
    wx.showModal({
      title: '删除商品',
      content: `是否删除“${name}”商品`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          // 确定
          const result = await request('deleteGoods', {
            goodsId
          }, 'delete', {
            authorization: token
          })
          if (result.data.code == 'ok') {
            wx.showToast({
              title: `“${name}”商品删除成功`,
              icon: 'none',
              duration: 1500
            })
            that.getGoodsList()
          } else {
            wx.showToast({
              title: result.data.msg || `“${name}”商品删除失败`,
              icon: 'none',
              duration: 1500
            })
          }
        } else if (res.cancel) {
          // 用户点击取消
        }
      }
    })
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