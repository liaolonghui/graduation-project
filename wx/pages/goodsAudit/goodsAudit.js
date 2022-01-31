import { request } from '../../request/index'
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    searchKey: '',
    pageNumber: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList()
  },

  async getGoodsList () {
    const { searchKey, pageNumber, pageSize } = this.data
    const result = await request('getGoodsList', {
      searchKey,
      pageNumber,
      pageSize
    })
    if (pageNumber === 1) {
      this.setData({
        goodsList: result.data
      })
    } else {
      this.setData({
        goodsList: this.data.goodsList.push(result.data)
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