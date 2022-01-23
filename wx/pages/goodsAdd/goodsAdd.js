import {request, ADD_GOODS_IMG_ADDRESS} from '../../request/index'

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
    imgs: [], // 商品图片地址数组
    html: '', // 富文本
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

  // 上传商品图片
  addGoodsImg () {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: ADD_GOODS_IMG_ADDRESS,
          filePath: res.tempFilePaths[0],
          name: 'goodsImg',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          formData: {},
          success: (resp) => {
            const img = JSON.parse(resp.data)
            that.setData({
              imgs: [
                ...that.data.imgs,
                {
                  img_id: img.name,
                  img_url: img.path
                }
              ]
            })
          }
        })
      }
    })
  },

  // 富文本输入时触发
  editorInput (e) {
    this.setData({
      html: e.detail.html
    })
  },

  // 表单提交
  async formSubmit (e) {
    // 要发送token 获取用户信息
    const token = wx.getStorageSync('token')
    // area是索引  要转换一下  areas[area]
    // category是索引 要转换一下 categories[category]._id
    let goods = e.detail.value
    if (!goods.name.trim()) return wx.showToast({
      title: '未填写商品名称',
      icon: 'none'
    })
    if (!goods.nowPrice) return wx.showToast({
      title: '未填写现价',
      icon: 'none'
    })
    if (!goods.amount) return wx.showToast({
      title: '未填写货存',
      icon: 'none'
    })
    if (!goods.tele) return wx.showToast({
      title: '未填写售后电话',
      icon: 'none'
    })
    if (!goods.name) return wx.showToast({
      title: '未填写商品名称',
      icon: 'none'
    })
    if (goods.area < 0 || goods.category < 0) {
      // 说明没有选择地区或分类
      return wx.showToast({
        title: '请选择地区或分类',
        icon: 'none'
      })
    }
    goods.area = this.data.areas[goods.area]
    goods.category = this.data.categories[goods.category]._id
    // 图片 imgs
    goods.imgs = this.data.imgs
    if (!goods.imgs.length) {
      return wx.showToast({
        title: '至少添加一张商品图片',
        icon: 'none'
      })
    }
    // 富文本的处理 html
    goods.html = this.data.html

    const result = await request('addGoods', goods, 'post', {
      authorization: token
    })
    if (result.data.code == 'ok') {
      wx.navigateBack()
      wx.showToast({
        title: '商品添加成功',
        icon: 'none'
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