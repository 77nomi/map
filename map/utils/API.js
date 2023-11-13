module.exports = {
  request: request,
}
const app = getApp()

function request(rquestParams) {
  if (!rquestParams.url) return;
  // let header = rquestParams.header ? rquestParams.header : {}
  let method = rquestParams.method || "GET";
  let data = rquestParams.data
  let url = app.globalData.api + rquestParams.url;
  if (method.toUpperCase() == "PUT") {
      let other = jsonUtils.connect_data(data);
      url += other;
  }
  wx.showLoading({
      title: "加载中",
      mask: true
  })
  return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data,
        // header: header,
        success: (res) => {
            wx.hideLoading();
            resolve(res);
        },
        fail: (err) => {
            wx.hideLoading();
            reject(err);
        }
      })
  })
}