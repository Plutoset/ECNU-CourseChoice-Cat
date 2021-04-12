// pages/user/user.js
Page({
  toGetUserProfile(e){
    var that=this;
    wx.getUserProfile({
      desc:"onloading...",
      success:function(res){
        console.log(res.userInfo);
        wx.setStorageSync('userinfo', res.userInfo);
        that.setData({userinfo:res.userInfo});
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  g(e){
    console.log(e)
  },

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{}

  },
  onShow(){
    const userinfo=wx.getStorageSync('userinfo');
    this.setData({userinfo})
  },

})