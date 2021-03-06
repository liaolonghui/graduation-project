import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level1Active: 0, // 当前显示的是哪一个一级分类
    categoryTree: []
  },

  // 改变level1Active
  changeLevel1Active (e) {
    this.setData({
      level1Active: e.target.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryTree()
  },

  async getCategoryTree () {
    const result = await request('getCategoryTree')
    this.setData({
      categoryTree: result.data.categoryTree
    })
  },

  // 跳转至搜索页 并传递所点击的三级分类的分类名
  tapCategorgLevel3 (e) {
    wx.navigateTo({
      url: '../search/search?type=' + e.currentTarget.dataset.level3name,
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
    this.getCategoryTree()
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