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
    categoryNames: [], // 父分类的名称数组
    parentIndex: 0, // 所选父分类的索引

    categoryName: '', // 分类名
    
    updateId: '', // 需要修改的分类的id （如果有说明此时是修改分类）
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
      this.setData({
        parentIndex: 0,
        categories: res.data.categories,
        categoryNames: res.data.categories.map(cate => cate.name)
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
  // addOrUpdateCategory 添加新分类      (修改分类也在这里)
  async addOrUpdateCategory () {
    const name = this.data.categoryName.trim()
    if (!name) return wx.showToast({
      title: '请填写分类名',
      icon: 'none',
      duration: 1500
    })
    if (name.length >= 5) {
      // 长度大于等于5就不让他添加
      return wx.showToast({
        title: '分类名长度不得超过4',
        icon: 'none',
        duration: 1500
      })
    }
    const level = parseInt(this.data.level) + 1
    const parentCategory = this.data.categories[this.data.parentIndex]
    const parent = parentCategory ? parentCategory._id : null
    const id = this.data.updateId // 需要修改的id   如果没有表示此时是添加分类

    let result
    let title = '添加新分类成功'
    if (id) {
      result = await request('updateCategory', {
        id,
        newCategory: {
          name,
          level,
          parent
        }
      }, 'put')
      title = '修改分类成功'
    } else {
      result = await request('addCategory', {
        name,
        level,
        parent
      }, 'post')
    }

    if (result.data.code == 'ok') {
      wx.showToast({
        title,
        duration: 1500
      })
    }
    this.setData({
      showDialog: false,
      categoryName: '',
      level: 0,
      categories: [],
      categoryNames: [],
      parentIndex: 0,
      updateId: ''
    })
    this.getCategoryList()

  },
  // 取消操作 (取消添加/修改)
  cancelCategory () {
    this.setData({
      showDialog: false,
      level: 0,
      categories: [],
      categoryNames: [],
      parentIndex: 0,
      categoryName: '',
      updateId: ''
    })
  },

  // 展示修改分类的对话框   （其实和添加的对话框是同一个）
  async showUpdateCategoryDialog (e) {
    // 要先拿到要修改的那个分类的信息 （level，parent，name，_id）
    // 先拿到索引
    const index = e.target.dataset.index
    let {
      level,
      parent,
      name,
      _id
    } = this.data.categoryList[index]

    // 先用level获取到categories
    await this.getCategoryList(level)

    this.setData({
      showDialog: true,
      level: level-1,
      categoryName: name,
      parentIndex: this.data.categories.findIndex(cate => cate._id == parent),
      updateId: _id
    })
  },

  // 删除分类
  deleteCategory (e) {
    // 先拿到索引
    const index = e.target.dataset.index
    let {
      name,
      _id
    } = this.data.categoryList[index]
    const that = this
    wx.showModal({
      title: '删除分类',
      content: `是否删除“${name}”分类`,
      confirmColor: '#eb4450',
      async success (res) {
        if (res.confirm) {
          // 确定
          const result = await request(`deleteCategory/${_id}`, {}, 'delete')
          if (result.data.code == 'ok') {
            wx.showToast({
              title: `“${name}”分类删除成功`,
              icon: 'none',
              duration: 1500
            })
            that.getCategoryList()
          } else {
            wx.showToast({
              title: `“${name}”分类删除失败`,
              icon: 'none',
              duration: 1500
            })
          }
        } else if (res.cancel) {
          // 用户点击取消
        }
      }
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