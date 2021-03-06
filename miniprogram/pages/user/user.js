// pages/user/user.js
Page({
  handleGetUserInfo(e){
    console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync('userinfo', userInfo);
    this.onShow();
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