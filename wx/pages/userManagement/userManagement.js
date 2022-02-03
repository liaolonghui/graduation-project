import { request } from "../../request/index"

// pages/userManagement/userManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    searchKey: '',
    pageNumber: 1,
    pageSize: 10
  },

  // 改变searchKey
  changeSearchKey (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
  },

  // 修改用户权限
  async changePower (e) {
    const token = wx.getStorageSync('token')
    const result = await request('updatePower', {
      id: e.target.dataset.id
    }, 'post', {
      authorization: token
    })
    if (result.data.code === 'ok') {
      wx.showToast({
        title: '修改成功',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        userList: this.data.userList.map(user => {
          if (user._id === e.target.dataset.id) {
            user.power = ( user.power === 'super' ? 'none' : 'super' )
          }
          return user
        })
      })
    } else {
      wx.showToast({
        title: result.data.msg,
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 删除用户
  async deleteUser (e) {
    const { id, name } = e.target.dataset
    const token = wx.getStorageSync('token')
    const that = this
    wx.showModal({
      title: '删除用户',
      content: `是否删除“${name}”用户`,
      confirmColor: '#eb4450',
      async success (res) {
        if (!res.confirm) return
        const result = await request('deleteUser', {
          id
        }, 'delete', {
          authorization: token
        })
        if (result.data.code === 'ok') {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000
          })
          that.setData({
            userList: that.data.userList.filter(user => user._id !== id)
          })
        } else {
          wx.showToast({
            title: result.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },

  // 下拉刷新
  async onPullDownRefresh () {
    this.setData({
      pageNumber: 1
    })
    await this.getUserList()
    wx.stopPullDownRefresh()
  },
  // 上拉加载
  onReachBottom () {
    console.log('上拉加载')
    this.setData({
      pageNumber: this.data.pageNumber + 1
    })
    this.getUserList()
  },

  // 搜索
  search () {
    this.setData({
      pageNumber: 1
    })
    this.getUserList()
  },

  async getUserList () {
    const { searchKey, pageNumber, pageSize } = this.data
    const result = await request('getUserList', {
      searchKey,
      pageNumber,
      pageSize
    })
    this.setData({
      userList: result.data
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