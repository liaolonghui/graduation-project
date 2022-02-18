const LOCAL_URL = 'http://127.0.0.1:666/api/'
const REMOTE_URL = ''

const BASE_URL = LOCAL_URL
// 用户头像上传地址
export const ADD_AVATAR_ADDRESS =  BASE_URL + 'uploadAvatar'
// 分类图标上传地址
export const ADD_CATEGORY_IMG_ADDRESS = BASE_URL + 'addCategoryImg'
// 商品图片上传地址
export const ADD_GOODS_IMG_ADDRESS = BASE_URL + 'addGoodsImg'

export const request = (url='', data={}, method='get', header={}) => {
  return new Promise((reslove, reject) => {
    wx.request({
      url: BASE_URL + url,
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