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
    courseChooseTemp: [0,0,0],
    courseChoose: ["请选择"],
    courseChooseList: {},
    courseComments: {},
    tagsList: null,
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
          courseChooseList: [res.result.data.map(i => i.sort), res.result.data[0].classes.map(i => i.class), res.result.data[0].classes[0].teachers]
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

  bindSearch: function () {
    if(this.data.courseChoose.length == 3)
      wx.cloud.callFunction({
        name: 'getComments',
        data: {
          sort: this.data.courseChoose[0],
          class: this.data.courseChoose[1],
          teacher: this.data.courseChoose[2]
        },
        success: res => {
          console.log(res.result)
          var tags = res.result.data.map(i => i.tag).flat()
          tags = tags.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null)) // DON'T MODIFY
          var tagarray = [];
          for(var i in tags)
            tagarray.push([i, tags[i]])
          tagarray.sort((a,b) => b[1] - a[1])
          console.log(tagarray)
          this.setData({
            courseComments: res.result.data.map(i => i.info),
            tagsList: tagarray.map(t => [t[0],"default"])
          })
        },
        fail: err => {
          console.error('[云函数] [getComments] 调用失败', err)
        }
      })
  },
  btnLike:function(e){
    var id = e.currentTarget.dataset.index
    var tagsList = this.data.tagsList
    tagsList[id][1] = tagsList[id][1] == "default"?"primary":"default"
    this.setData({
      tagsList
    })
  }

})
