import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数据
    navBarList: [],
    // 推荐
    recommend: [],
    // 地区数据
    areaBarTitleImg: '',
    areaBarList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getNavBarList()
    this.getRecommend()
    this.getAreaBarList()
  },

  async getSwiperList () {
    const res = await request('getSwiperList')
    this.setData({
      swiperList: res.data.swiperList
    })
  },

  async getNavBarList () {
    const res = await request('getNavBarList')
    this.setData({
      navBarList: res.data.navBarList
    })
  },

  async getRecommend () {
    const res = await request('getRecommend')
    this.setData({
      recommend: res.data.recommend
    })
  },

  async getAreaBarList () {
    const res = await request('getAreaBarList')
    this.setData({
      areaBarTitleImg: res.data.areaBarTitleImg,
      areaBarList: res.data.areaBarList
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