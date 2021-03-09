const app = getApp()

Page({
  data: {
    courseList: {},
    courseChooseTemp: [0,0,0],
    courseChoose: [">请选择"],
    courseChooseList: {},
    myCourses:{},
    openID: '',
    myComment:"",
    allTags:[['硬核',"default"],['避雷',"default"],['推荐',"default"],['容易',"default"],['有趣',"default"],['严格',"default"],['枯燥',"default"],['不错',"default"]],
  },

  onLoad: function (options) {
   
    wx.cloud.callFunction({
      name: 'login',
      data:{},
      success: res => {
        console.log(res.result)
        this.setData({
          openID: res.result.openid,
        })
        this.getMyCourses()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    
    
    wx.cloud.callFunction({
      name: 'getcourselist',
      data: {},
      success: res => {
        console.log(res.result)
        this.setData({
          courseList: res.result.data,
          courseChooseList: [res.result.data.map(i => i.sort), res.result.data[0].classes.map(i => i.class), res.result.data[0].classes[0].teachers]
        })
      },
      fail: err => {
        console.error('[云函数] [getcourselist] 调用失败', err)
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

  bindcmtMyCourses:function (e) {
    console.log('内容为：', e.detail.text) 
    this.setData({
      myComment: e.detail.text,
    })
  },

  cmtMyComments:  function () {
    if(this.data.courseChoose.length == 3)
      wx.cloud.callFunction({
        name: 'cmtMyComments',
        data: {
          sort: this.data.courseChoose[0],
          class: this.data.courseChoose[1],
          teacher: [this.data.courseChoose[2]],
          student: this.data.openID,
          tag: this.data.allTags.map(i => i[1] == "primary" ? i[0] : null).filter(Boolean),
          info: this.data.myComment,
        },
        success: res => {  
          wx.showToast({
            title: '添加成功',
            duration: 2000
          })        
        },
        fail: err => {
          console.error('[云函数] [cmtMyCourses] 调用失败', err)
          wx.showToast({
            title: '添加失败',
            duration: 2000
          })
        },
      })
      this.getMyCourses()
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        this.setData({
          courseChooseTemp: [e.detail.value, 0, 0],
          courseChooseList: [this.data.courseChooseList[0], this.data.courseList[e.detail.value].classes.map(i => i.class), this.data.courseList[e.detail.value].classes[0].teachers]
        })
        break;
      case 1:
        this.setData({
          courseChooseTemp: [this.data.courseChooseTemp[0],e.detail.value,0],
          courseChooseList: [this.data.courseChooseList[0], this.data.courseChooseList[1], this.data.courseList[this.data.courseChooseTemp[0]].classes[e.detail.value].teachers]
        })
        break;
      case 2:
        this.setData({
          courseChooseTemp: [this.data.courseChooseTemp[0], this.data.courseChooseTemp[1], e.detail.value]
          //courseChooseList: [this.data.courseChooseList[0], this.data.courseList[e.detail.value].class, this.data.courseList[e.detail.value].teacher]
        })
    }
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseChoose: [this.data.courseChooseList[0][this.data.courseChooseTemp[0]], this.data.courseChooseList[1][this.data.courseChooseTemp[1]],this.data.courseChooseList[2][this.data.courseChooseTemp[2]] ]
    })
  },
  
  getMyCourses: function(){
    wx.cloud.callFunction({
      name: 'getMyCourses',
      data: {
        openid: this.data.openID,
      },
      success: res => {
        console.log(res.result)
        this.setData({          
          myCourses: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getMyCourses] 调用失败', err)
      }
    })
  } ,
  btnLike:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.index
    var allTags = this.data.allTags
    allTags[id][1] = allTags[id][1] == "default"?"primary":"default"
    this.setData({
      allTags
    })
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      inputVal:e.detail.value
    }) 
  }, 
  
  formSubmit: function(e) {
    console.log(that.data.inputVal)
  },
})

 


