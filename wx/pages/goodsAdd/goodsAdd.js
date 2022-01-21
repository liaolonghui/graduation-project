import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaIndex: -1,
    areas: ['湖北','陕西','江西','甘肃','四川','云南','广西','宁夏','新疆','河南','河北','黑龙江','青海','吉林','贵州'], // area
    categoryIndex: -1,
    categories: [], // category 详细信息
    categoryNames: [], // category 分类名集合
  },

  // 地区选择器的函数
  bindAreaPickerChange: function(e) {
    this.setData({
      areaIndex: e.detail.value
    })
  },

  // 分类选择的函数
  bindCategoryPickerChange: function(e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategory()
  },

  // 获取可选择的分类列表
  async getCategory () {
    const result = await request('/getCategory', {
      level: 3
    })
    if (result.data.code == 'ok') {
      this.setData({
        categories: result.data.categories,
        categoryNames: result.data.categories.map(c => c.name)
      })
    }
  },

  // 表单提交
  formSubmit (e) {
    // 要发送token 获取用户信息
    // area是索引  要转换一下  areas[area]
    // category是索引 要转换一下 categories[category]._id

    // 图片 imgs

    // 富文本的处理 html

    console.log(e.detail.value)
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