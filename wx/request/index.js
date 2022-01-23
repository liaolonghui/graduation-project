export const ADD_AVATAR_ADDRESS = 'http://127.0.0.1:666/api/uploadAvatar'

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