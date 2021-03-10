// pages/preference/preference.js
Page({

  data: {
    recommendation:[["网球","王德建"],["流行舞","马素"]],
    openID: "",
    recommendinfo: null,
    tagsList:null,
    myCourses: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data:{},
      success: res => {
        console.log(res.result)
        this.setData({
          openID: res.result.openid,
        })
        this.getRecommendation()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

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

  getRecommendation: function(){
    var openid = this.data.openID
    var that = this
    wx.cloud.callFunction({
      name: 'countMyComments',
      data:{
        student: this.data.openID
      },
      success: async function(res) {
        console.log(res.result)
        if (res.result.list[0].count < 3) {
          this.setData({
            recommendinfo: "你仅上传了" + res.result.list[0].count + "条评论, 还不能获得推荐课程",
          })
          return
        }

        const r = await wx.cloud.callContainer({
          path: '/container-python/recommend/' + openid,
          method: 'GET',
        })
        
        console.log(r)

        that.setData({
          myCourses: r.data
        })
      },
      fail: err => {
        console.error('[云函数] [countMyComments] 调用失败', err)
      }
    })
  },

  getClassCmt: function (e) {
    var id = e.currentTarget.dataset.index
    if(!this.data.myCourses[id].comments)
      wx.cloud.callFunction({
        name: 'getComments',
        data: {
          sort: this.data.myCourses[id].sort,
          class: this.data.myCourses[id].class,
          teacher: this.data.myCourses[id].teacher[0]
        },
        success: res => {
          console.log(res.result)
          var comments = res.result.data.map(i => i.info)
          var myCourses = this.data.myCourses
          myCourses[id]['comments'] = comments
          this.setData({
            myCourses,
          })
        },
        fail: err => {
          console.error('[云函数] [getComments] 调用失败', err)
        }
      })
  },
  test:function(e){
    console.log(e)
  },

})

