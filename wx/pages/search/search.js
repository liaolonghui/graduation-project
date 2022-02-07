import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    searchArea: '', // 所属地区
    searchType: '', // 所属分类
    searchOrder: '', // 排序方式
    goodsList: [],
    pageNumber: 1,
    pageSize: 10,
  },

  bindSearchKey (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.area !== '年货') { // 有个数据是年货，表示不限制地区
      this.setData({
        searchArea: options.area
      })
    }
    this.setData({
      searchType: options.type
    })

    // 获取goodsList 
    this.getGoodsList()

  },

  async getGoodsList () {
    const { searchKey, searchType, searchArea, searchOrder, pageNumber, pageSize } = this.data
    const result = await request('searchGoods', {
      searchKey,
      categoryName: searchType,
      area: searchArea,
      order: searchOrder,
      pageNumber,
      pageSize
    })
    if (result.data.code === 'ok') {
      this.setData({
        goodsList: result.data.goodsList
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