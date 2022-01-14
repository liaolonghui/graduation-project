// pages/goodsCategory/goodsCategory.js
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false, // 控制dialog的显隐
    categoryList: [], // 所有分类
    array: ['第一级别', '第二级别', '第三级别'],
    level: 0, // 级别0-2  发送到服务端时需要+1  变成1-3
    categories: [], // 这个是在新建/修改分类时选择父级分类时使用的 （父分类）
    parentIndex: 0, // 所选父分类的索引
    categoryName: '', // 分类名
  },

  // level索引
  bindLevelPickerChange: function(e) {
    if (this.data.level == e.detail.value) return
    this.setData({
      level: e.detail.value
    })
    // level发生变化后就发请求获取categories
    // 因为level从0开始 所以要+1
    this.getCategoryList(parseInt(e.detail.value) + 1)
  },
  // 父分类索引
  bindParentPickerChange: function(e) {
    if (this.data.parentIndex == e.detail.value) return
    this.setData({
      parentIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryList()
  },

  // getCategoryList
  async getCategoryList (level) {
    const res = await request('getCategory', {level})
    if (res.data.code !== 'ok') return wx.showToast({
      title: '获取分类列表失败',
      icon: 'none',
      duration: 1500
    })
    // 1<=level<=3 时说明是保存到categories
    if (level>=1 && level<=3) {
      console.log(level)
      this.setData({
        categories: res.data.categories
      })
    } else {
      this.setData({
        categoryList: res.data.categories
      })
    }
  },

  // categoryNameChange 分类名变化
  categoryNameChange (e) {
    this.setData({
      categoryName: e.detail.value
    })
  },

  // 显示对话框
  showCategoryDialog () {
    this.setData({
      showDialog: true
    })
  },
  // addCategory 添加新分类
  async addCategory () {
    const name = this.data.categoryName.trim()
    if (!name) return wx.showToast({
      title: '请填写分类名',
      icon: 'none',
      duration: 1500
    })
    const level = this.data.level + 1
    const parentCategory = this.data.categories[this.data.level]
    const parent = parentCategory ? parentCategory._id : null

    const result = await request('addCategory', {
      name,
      level,
      parent
    }, 'post')

    if (result.data.code == 'ok') {
      wx.showToast({
        title: '添加新分类成功',
        duration: 1500
      })
    }
    this.setData({
      showDialog: false,
      categoryName: '',
      level: 0,
      categories: [],
      parentIndex: 0
    })
    this.getCategoryList()

  },
  // 取消操作 (取消添加/修改)
  cancelCategory () {
    this.setData({
      showDialog: false,
      level: 0,
      categories: [],
      parentIndex: 0
    })
  },

  // 修改分类

  // 删除分类


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