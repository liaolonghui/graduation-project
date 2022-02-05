import { request } from '../../request/index'
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    total: 0, // goods总数
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

  // 前往商品详情
  toGoodsDetail (e) {
    const goodsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList()
  },

  // 下拉刷新
  async onPullDownRefresh () {
    this.setData({
      pageNumber: 1
    })
    await this.getGoodsList()
    wx.stopPullDownRefresh()
  },
  // 上拉加载
  onReachBottom () {
    const { goodsList, total } = this.data
    if (goodsList.length >= total) return
    this.setData({
      pageNumber: this.data.pageNumber + 1
    })
    this.getGoodsList()
  },

  // 搜索
  search () {
    this.setData({
      pageNumber: 1
    })
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
        goodsList: result.data.goodsList,
        total: result.data.total
      })
    } else {
      this.setData({
        goodsList: this.data.goodsList.concat(result.data.goodsList),
        total: result.data.total
      })
    }
  },

  // 改变商品审核状态state
  async changeGoodsState (e) {
    const token = wx.getStorageSync('token')
    const { id: goodsId, state } = e.target.dataset
    console.log(goodsId, state)
    const result = await request('auditGoods', {
      goodsId,
      state: !state
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
        goodsList: this.data.goodsList.map((goods) => {
          if (goods._id === goodsId) {
            goods.state = !goods.state
          }
          return goods
        })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})