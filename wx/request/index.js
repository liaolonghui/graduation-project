export const request = (url='', data={}, method='get') => {
  return new Promise((reslove, reject) => {
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/' + url,
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