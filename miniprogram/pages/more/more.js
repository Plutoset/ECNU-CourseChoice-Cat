// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top : -200,
    flag : -1
  },
  change:function(e){
    top = this.data.top * this.data.flag;
    this.setData({
      top
    }) ;
    this.onShow();
  }

})