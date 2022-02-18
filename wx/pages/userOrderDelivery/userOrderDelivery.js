import { request } from "../../request/index"

// pages/goodsDelivery/goodsDelivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['全部', '待发货', '待收货', '待评价', '已评价'],
    orderType: '全部',
    orders: [], // 全部订单
    orderList: [], // 筛选后显示的对应state订单
    trackModalBool: true, // 填写快递单号的对话框  （是否隐藏，true则是隐藏）
    orderId: '', // 快递单号对应的订单号
    trackingNumber: '', // 快递单号
  },

  // 去订单详情页
  toOrderDetail (e) {
    wx.navigateTo({
      url: '../userOrderDetail/userOrderDetail?orderArr=' + [e.currentTarget.dataset.id],
    })
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

  // stopTouch
  stopTouch () {
    return false
  },

  // changeTrackingNumber
  changeTrackingNumber (e) {
    this.setData({
      trackingNumber: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 订单发货 （显示填写快递单号的对话框）
  deliveryOrder (e) {
    const orderId = e.currentTarget.dataset.id
    this.setData({
      orderId,
      trackModalBool: false
    })
  },
  hiddenTrackModal () {
    this.setData({
      trackModalBool: true
    })
  },
  async delivery () {
    // 发货
    const { orderId, trackingNumber } = this.data
    const token = wx.getStorageSync('token')
    const { data: result } = await request('delivery', {
      orderId,
      trackingNumber
    }, 'post', {
      authorization: token
    })
    if (result && result.code === 'ok') {
      wx.showToast({
        title: '发货成功',
        icon: 'none',
        duration: 1000
      })
      this.getOrders()
    }
    this.setData({
      trackModalBool: true,
      trackingNumber: ''
    })
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