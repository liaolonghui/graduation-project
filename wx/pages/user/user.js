// pages/user/user.js
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果用户没有登录就让他登录
    const that = this
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        // 如果session_key未过期 但是本地没有token时
        const token = wx.getStorageSync('token')
        if (!token) {
          // 登录
          that.login()
        }
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        //重新登录
        that.login()
      },
      complete () {
        // 最后获取一下用户信息
        wx.getUserInfo({
          success (res) {
            that.setData({
              userInfo: res.userInfo
            })
          }
        })
      }
    })
  },

  // 登录
  login () {
    wx.login({
      async success(res) {
        if (res.code) {
          const result = await request('login', {
            code: res.code
          }, 'post')
          if (result.data.token) {
            // 把获取到的用户信息保存
            wx.setStorageSync('token', result.data.token)
          }
        }
      }
    })
  },

  // 选择收货地址
  chooseAddress () {
    wx.chooseAddress({
      success (res) {
        console.log(res)
      }
    })
  },

  // 发布商品

  // 商品审核

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