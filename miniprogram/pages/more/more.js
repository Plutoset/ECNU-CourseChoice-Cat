// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttontype : "primary",
    catfile: "../../icon/cat.svg"
  },

  change:function(e){
    this.setData({
      buttontype: "default",
      catfile: "../../icon/wink.svg"
    }) ;
  }

})