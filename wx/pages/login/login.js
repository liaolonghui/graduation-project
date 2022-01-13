import { request } from "../../request/index"

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // formSubmit 登录
  async formSubmit (e) {
    const { accountNumber, password } = e.detail.value
    // 这里只做简单的判断
    if (accountNumber.length >= 4 && password.length >= 4) {
      // 账号密码长度都大于等于4就发请求
      const res = await request('login', {
        accountNumber,
        password
      }, 'post')
      if (res.data.code == 'ok') {
        wx.setStorageSync('token', res.data.token)
        wx.navigateBack({
          delta: 0,
        })
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000//持续的时间
        })
      } else {
        wx.showToast({
          title: '账号或密码错误',
          icon: 'none',
          duration: 1000//持续的时间
        })
      }
    }
  },

  // 去注册页
  register () {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  // formInputFocus
  formInputFocus (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  // formInputBlur
  formInputBlur () {
    this.setData({
      activeIndex: 0
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