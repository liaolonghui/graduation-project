import { request } from "../../request/index"

// pages/userOrder/userOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['全部', '待付款', '待发货', '待收货', '待评价', '已取消'],
    orderType: '全部',
    orders: [], // 全部订单
    orderList: [], // 筛选后显示的对应state订单
    comment: '', // 评论
    orderId: '', // 评论的订单id
    commentModalBool: true, // 评论的对话框是否隐藏 true隐藏
  },

  // changeComment
  changeComment (e) {
    this.setData({
      comment: e.detail.value
    })
  },

  // 显示对话框
  showCommentModal (e) {
    this.setData({
      comment: '',
      orderId: e.currentTarget.dataset.id,
      commentModalBool: false
    })
  },
  // 隐藏评论对话框
  hiddenCommentModal () {
    this.setData({
      commentModalBool: true
    })
  },

  // stopTouch
  stopTouch () {
    return
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

  // 去订单详情页
  toOrderDetail (e) {
    const orderArr = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../userOrderDetail/userOrderDetail?orderArr=' + orderArr,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderType) {
      this.setData({
        orderType: options.orderType
      })
    }
  },

  // 支付订单
  payOrder (e) {
    const that = this
    wx.showModal({
      title: '支付订单',
      content: `是否支付该订单？`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          const orderId = e.currentTarget.dataset.id
          const result = await request('pay', {
            orderId
          }, 'post', {
            authorization: token
          })
          if (result.data && result.data.code === 'ok') {
            that.getOrders()
          }
          wx.showToast({
            title: result.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 取消订单
  cancelOrder (e) {
    const that = this
    wx.showModal({
      title: '取消订单',
      content: `是否取消该订单？`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          const orderId = e.currentTarget.dataset.id
          const result = await request('cancel', {
            orderId
          }, 'post', {
            authorization: token
          })
          if (result.data && result.data.code === 'ok') {
            that.getOrders()
          }
          wx.showToast({
            title: result.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  // 收货
  takeOver (e) {
    const that = this
    wx.showModal({
      title: '收货',
      content: `是否已收到货物？`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          const orderId = e.currentTarget.dataset.id
          const result = await request('takeOver', {
            orderId
          }, 'post', {
            authorization: token
          })
          if (result.data && result.data.code === 'ok') {
            that.getOrders()
          }
          wx.showToast({
            title: result.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  // 评价
  async appraise () {
    const { orderId, comment } = this.data
    const token = wx.getStorageSync('token')
    const { data: result } = await request('appraise', {
      orderId,
      content: comment
    }, 'post', {
      authorization: token
    })
    if (result && result.code === 'ok') {
      wx.showToast({
        title: '评论发送成功',
        icon: 'none',
        duration: 1500
      })
      this.getOrders()
    }
    this.setData({
      commentModalBool: true,
      comment: ''
    })
  },

  // 获取全部订单
  async getOrders() {
    const token = wx.getStorageSync('token')
    const result = await request('getOrderList', {}, 'get', {
      authorization: token
    })
    if (result.data && result.data.code === 'ok') {
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