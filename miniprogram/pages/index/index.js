//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    courseList: {},
    courseChooseTemp: [-1,0],
    courseChoose: ["请选择"],
    courseChooseList: {},
    courseComments: {}
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    wx.cloud.callFunction({
      name: 'getcourselist',
      data: {},
      success: res => {
        console.log(res.result)
        this.setData({
          courseList: res.result.data,
          courseChooseList: [res.result.data.map(i => {return i._id}),[]]
        })
      },
      fail: err => {
        console.error('[云函数] [getcourselist] 调用失败', err)
      }
    })

  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        this.setData({
          courseChooseTemp: [e.detail.value, 0],
          courseChooseList: [this.data.courseChooseList[0], this.data.courseList[e.detail.value].teacher]
        })
        break;
      case 1:
        this.setData({
          courseChooseTemp: [this.data.courseChooseTemp[0],e.detail.value]
        })
        break;
    }
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseChoose: [this.data.courseChooseList[0][this.data.courseChooseTemp[0]], this.data.courseChooseList[1][this.data.courseChooseTemp[1]]]
    })
  },

  bindSearch: function () {
    if(this.data.courseChoose.length == 2)
      wx.cloud.callFunction({
        name: 'getComments',
        data: {
          class: this.data.courseChoose[0],
          teacher: this.data.courseChoose[1]
        },
        success: res => {
          console.log(res.result)
          this.setData({
            courseComments: res.result.data.map(i => {return i.info})
          })
        },
        fail: err => {
          console.error('[云函数] [getComments] 调用失败', err)
        }
      })
  }

})
