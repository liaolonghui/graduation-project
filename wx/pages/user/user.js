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
    this.getUserInfo()
  },

  // 获取用户信息
  async getUserInfo () {
    // 如果有token就直接获取用户信息 (要确保userInfo为空对象，这里判断nickName即可)
    const token = wx.getStorageSync('token')
    const nickName = this.data.userInfo.nickName
    if (token && !nickName) {
      // 发请求获取用户信息
      const res = await request('getUserInfo', {}, 'get', {
        authorization: token
      })
      if (res.data.code == 'ok') {
        this.setData({
          userInfo: {
            avatar: res.data.avatar,
            nickName: res.data.nickName,
            power: res.data.power
          }
        })
      } else {
        this.setData({
          userInfo: {}
        })
      }
    }
  },

  // 去登录页面
  login () {
    if (this.data.userInfo.nickName) {
      // 如果有用户名就表示已经登录了，所以不跳转到login页
      return
    }
    wx.navigateTo({
      url: '../login/login',
    })
  },

  // 退出登录
  logout () {
    if (!this.data.userInfo.nickName) {
      // 如果没有用户名就表示未登录，所以不要往下执行
      return
    }
    this.setData({
      userInfo: {}
    })
    wx.removeStorageSync('token')
  },

  // 选择收货地址 ?  其实作用是查看或添加收获地址
  chooseAddress () {
    const nickName = this.data.userInfo.nickName
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.chooseAddress({
      success (res) {
        console.log(res)
      }
    })
  },
  // 去收藏页
  toUserFavorites () {
    const nickName = this.data.userInfo.nickName
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.navigateTo({
      url: '../userFavorites/userFavorites',
    })
  },
  // 发布商品页
  togoodsRealease () {
    const nickName = this.data.userInfo.nickName
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.navigateTo({
      url: '../goodsRelease/goodsRelease',
    })
  },
  // 去打包发货页
  togoodsDelivery () {
    const nickName = this.data.userInfo.nickName
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.navigateTo({
      url: '../userOrderDelivery/userOrderDelivery',
    })
  },
  // 用户管理  管理员专属
  toUserManagement () {
    const {nickName, power} = this.data.userInfo
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断power是否为 super
    if (power != 'super') {
      // 不是管理员则提示
      return wx.showToast({
        title: '权限不足',
        icon: 'none',
        duration: 1000
      })
    }
    wx.navigateTo({
      url: '../userManagement/userManagement',
    })
  },
  // 分类 管理员专属
  toGoodsCategory () {
    const {nickName, power} = this.data.userInfo
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断power是否为 super
    if (power != 'super') {
      // 不是管理员则提示
      return wx.showToast({
        title: '权限不足',
        icon: 'none',
        duration: 1000
      })
    }
    wx.navigateTo({
      url: '../goodsCategory/goodsCategory',
    })
  },
  // 商品审核 管理员专属
  toGoodsAudit () {
    const {nickName, power} = this.data.userInfo
    if (!nickName) {
      // 未登录则跳转至登录页
      wx.navigateTo({
        url: '../login/login',
      })
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断power是否为 super
    if (power != 'super') {
      // 不是管理员则提示
      return wx.showToast({
        title: '权限不足',
        icon: 'none',
        duration: 1000
      })
    }
    wx.navigateTo({
      url: '../goodsAudit/goodsAudit',
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
    this.getUserInfo()
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