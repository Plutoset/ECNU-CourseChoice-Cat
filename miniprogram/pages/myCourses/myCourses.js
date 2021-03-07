Page({
  data: {
    courseChoose: ["请选择"]
  },

  onLoad: function (options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  cmtMyCourses:  function () {
    //if(this.data.courseChoose.length == 3)
      wx.cloud.callFunction({
        name: 'cmtMyCourses',
        data: {
          sort: "英语类",
          class: "学术英语写作",
          teacher: ["关晓仙"],
          student: "cyy",
          tag: [],
          info: [],
          //sort: "英语类",
          //class: "学术英语写作",
          //teacher: ["关晓仙"],
          //student: "cyy",
          //tag: [],
          //info: [],
        },
        success: res => {  
        },
        fail: err => {
          console.error('[云函数] [cmtMyCourses] 调用失败', err)
        }
      })
  }
})

