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
    areaArray: ['湖北','陕西','江西','甘肃','四川','云南','广西','宁夏','新疆','河南','河北','黑龙江','青海','吉林','贵州'],
    cateArray: [],
    orderArray: ['价格最高', '价格最低', '销量最高', '销量最低'],
  },

  bindOrderPickerChange: function(e) {
    this.setData({
      pageNumber: 1,
      searchOrder: this.data.orderArray[e.detail.value]
    })
    this.getGoodsList()
  },

  bindCatePickerChange: function(e) {
    this.setData({
      pageNumber: 1,
      searchType: this.data.cateArray[e.detail.value]
    })
    this.getGoodsList()
  },

  bindAreaPickerChange: function(e) {
    this.setData({
      pageNumber: 1,
      searchArea: this.data.areaArray[e.detail.value]
    })
    this.getGoodsList()
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

    this.getLevel3Category()
  },

  // 搜索 输入框
  search (e) {
    this.setData({
      searchKey: e.detail.value,
      pageNumber: 1
    })
    this.getGoodsList()
  },

  // 获取所有三级分类
  async getLevel3Category () {
    const result = await request('getCategory', {
      level: 3
    })
    if (result.data.code === 'ok') {
      const cateArray = result.data.categories.map(item => item.name)
      this.setData({
        cateArray
      })
    }
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
      if (pageNumber === 1) {
        this.setData({
          total: result.data.total,
          goodsList: result.data.goodsList
        })
      } else {
        this.setData({
          total: result.data.total,
          goodsList: this.data.goodsList.concat(result.data.goodsList)
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
  onPullDownRefresh: async function () {
    this.setData({
      pageNumber: 1
    })
    await this.getGoodsList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { pageNumber, total, goodsList } = this.data
    if (goodsList.length >= total) return
    this.setData({
      pageNumber: pageNumber + 1
    })
    this.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})