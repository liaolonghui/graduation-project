import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [], // 订单数组
    ordersId: [], // 订单的id数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.orderArr.split(',')
    })
    this.getOrders()
  },

  // pay 支付订单
  pay () {
    const that = this
    wx.showModal({
      title: '订单支付',
      content: '是否支付该订单？',
      cancelColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          const ordersId = that.data.ordersId
          const token = wx.getStorageSync('token')
          let count = 0
          for (let i=0; i<ordersId.length; i++) {
            const orderId = ordersId[i]
            const { data: result } = await request('pay', {
              orderId
            }, 'post', {
              authorization: token
            })
            if (result.code === 'ok') {
              count++
            }
          }
          if (count === ordersId.length) {
            wx.showToast({
              title: '订单支付成功',
              icon: 'none'
            })
            that.getOrders()
          } else {
            wx.showToast({
              title: '订单支付失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 修改to
  changeTo () {
    const that = this
    // 只有 ‘待付款’ 的订单才能修改收货信息
    const state = this.data.orders[0].state
    if (state === '已取消') return wx.showToast({
      title: '交易已取消',
      icon: 'none'
    })
    if (state !== '待付款') return
    wx.chooseAddress({
      async success (res) {
        const to = {
          name: res.userName,
          tel: res.telNumber,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo
        }
        const ordersId = that.data.ordersId
        const token = wx.getStorageSync('token')
        const { data: result } = await request('changeTo', {
          to,
          ordersId
        }, 'post', {
          authorization: token
        })
        if (result && result.code === 'ok') {
          wx.showToast({
            title: '收货信息修改成功',
            icon: 'none'
          })
          that.getOrders()
        }
      }
    })
  },

  // 获取订单详情
  async getOrders () {
    const token = wx.getStorageSync('token')
    const ordersId = this.data.ordersId
    const { data: res } = await request('getOrderDetail', {
      orderArr: ordersId
    }, 'post', {
      authorization: token
    })
    if (res && res.code === 'ok') {
      this.setData({
        orders: res.orders
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