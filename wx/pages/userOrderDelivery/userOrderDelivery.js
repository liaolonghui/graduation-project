import { request } from "../../request/index"

// pages/goodsDelivery/goodsDelivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['全部', '待发货', '待收货', '待评价'],
    orderType: '全部',
    orders: [], // 全部订单
    orderList: [], // 筛选后显示的对应state订单
  },

  // 修改orderType
  changeType (e) {
    const orderType = e.target.dataset.type
    const orders = this.data.orders
    if (orderType !== '全部') {
      this.setData({
        orderType,
        orderList: orders.filter(order => order.state === orderType)
      })
    } else {
      this.setData({
        orderType,
        orderList: orders
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 订单发货
  deliveryOrder (e) {
    const orderId = e.currentTarget.dataset.id
  },

  // 获取商家订单
  async getOrders () {
    const token = wx.getStorageSync('token')
    const result = await request('getOrderList', {
      type: 'seller'
    }, 'get', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      this.setData({
        orders: result.data.orders
      })
    }
    // 要在页面显示的订单列表
    const {orderType, orders} = this.data
    if (orderType !== '全部') {
      this.setData({
        orderType,
        orderList: orders.filter(order => order.state === orderType)
      })
    } else {
      this.setData({
        orderType,
        orderList: orders
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
    this.getOrders()
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