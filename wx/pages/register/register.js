// pages/register/register.js
import {request, ADD_AVATAR_ADDRESS} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    // 用于控制输入框的样式修改
    activeIndex: 0,
  },

  bindInputFocus (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  bindInputBlur () {
    this.setData({
      activeIndex: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 选择头像并上传
  chooseImage () {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: ADD_AVATAR_ADDRESS,
          filePath: res.tempFilePaths[0],
          name: 'avatar',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          formData: {},
          success: (resp) => {
            that.setData({
              avatar: JSON.parse(resp.data).path
            })
          }
        })
      }
    })
  },

  // register
  async register (e) {
    const { nickName, accountNumber, password } = e.detail.value
    const avatar = this.data.avatar
    if (nickName.length >= 2 && accountNumber.length >= 4 && password.length >= 4 && avatar) {
      const res = await request('register', {
        avatar,
        nickName,
        accountNumber,
        password
      }, 'post')
      // 注册成功
      if (res.data.code == 'ok') {
        wx.navigateBack({
          delta: 0,
        })
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1000//持续的时间
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000//持续的时间
        })
      }
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