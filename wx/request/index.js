export const request = (url='', data={}, method='get') => {
  return new Promise((reslove, reject) => {
    wx.request({
      url: 'http://127.0.0.1:666/api/' + url,
      method,
      data,
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}