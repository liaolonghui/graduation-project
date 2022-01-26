// 用户头像上传地址
export const ADD_AVATAR_ADDRESS = 'http://127.0.0.1:666/api/uploadAvatar'
// 分类图标上传地址
export const ADD_CATEGORY_IMG_ADDRESS = 'http://127.0.0.1:666/api/addCategoryImg'
// 商品图片上传地址
export const ADD_GOODS_IMG_ADDRESS = 'http://127.0.0.1:666/api/addGoodsImg'

export const request = (url='', data={}, method='get', header={}) => {
  return new Promise((reslove, reject) => {
    wx.request({
      url: 'http://127.0.0.1:666/api/' + url,
      method,
      data,
      header,
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}