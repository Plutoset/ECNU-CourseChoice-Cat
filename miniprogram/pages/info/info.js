var app = getApp()
Page({
  data: {},
  bindViewTap: function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onShow: function (options) {
    var detail = app.globalData.item;
    console.log(detail)
    this.setData({detail:app.globalData.item});
  }
}
)

