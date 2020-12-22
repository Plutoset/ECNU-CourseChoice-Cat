//index.js
//获取应用实例
var app = getApp()
var localdata = require("../../pages/data.js")
var showinfo=localdata.testJsonList

Page({
  data: {
    infopage:'/pages/info/',
    multiArray: [["篮球","游泳","羽毛球","瑜伽","太极拳","乒乓球","流行舞","排球","形体礼仪训练","拳术","网球","足球","英式橄榄球","体育舞蹈","健身气功","健美操","中华射艺"], ['李利斌','倪刚','丁洪祥','吴松福','朱毅','熊文','张骏','马成国','邱进宇','刘颉','宋全贞','孙柳青']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '篮球'
        },
        {
          id: 1,
          name: '游泳'
        },
        {
          id: 2,
          name: '羽毛球'
        },
        {
          id: 3,
          name: '瑜伽'
        },
        {
          id: 4,
          name: '太极拳'
        },
        {
          id: 5,
          name: '乒乓球'
        },
        {
          id: 6,
          name: '流行舞'
        },
        {
          id: 7,
          name: '排球'
        },
        {
          id: 8,
          name: '形体礼仪训练'
        },
        {
          id: 9,
          name: '拳术'
        },
        {
          id: 10,
          name: '网球'
        },
        {
          id: 11,
          name: '足球'
        },
        {
          id: 12,
          name: '英式橄榄球'
        },
        {
          id: 13,
          name: '体育舞蹈'
        },
        {
          id: 14,
          name: '健身气功'
        },
        {
          id: 15,
          name: '健美操'
        },
        {
          id: 16,
          name: '中华射艺'
        }
        
      ], [
        {
          id: 0,
          name: '李利斌'
        },
        {
          id: 1,
          name: '倪刚'
        },
        {
          id: 2,
          name: '丁洪祥'
        },
        {
          id: 3,
          name: '吴松福'
        },
        {
          id: 4,
          name: '朱毅'
        },
        {
          id: 5,
          name: '熊文'
        },
        {
          id: 6,
          name: '张骏'
        },
        {
          id: 7,
          name: '马成国'
        },
        {
          id: 8,
          name: '邱进宇'
        },
        {
          id: 9,
          name: '刘颉'
        },
        {
          id: 10,
          name: '宋全贞'
        },
        {
          id: 11,
          name: '孙柳青'
        }
      ]
    ],
    multiIndex: [0, 0],
    multiValue: ["篮球","李利斌"],
    ccc:JSON.stringify(["篮球","李利斌"]),
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['李利斌','倪刚','丁洪祥','吴松福','朱毅','熊文','张骏','马成国','邱进宇','刘颉','宋全贞','孙柳青'];
            break;
          case 1:
            data.multiArray[1] = ['李琳', '沈伟涛', '李利斌','孙鸿','钱斌翔','张中印','包雪鸣'];
            break;
          case 2:
            data.multiArray[1]=['陈彩珍','丁洪祥','郝翔','梁志勤','钟晖','李利斌','熊文'];
            break;
          case 3:
            data.multiArray[1] = ['孙鸿', '赵婧'];
            break;
          case 4:
            data.multiArray[1] = ['苏坚贞','张震'];
            break;
          case 5:
            data.multiArray[1] = ['陆建平','李玉强','钟晖','龚建华','何耀慧','李琳','虞轶群','侯建茹','马妍'];
            break;
          case 6:
            data.multiArray[1] = ['马素','沈越','周婷'];
            break;
          case 7:
            data.multiArray[1] = ['刘琼','马妍','邱进宇','阎健','陈丽娟','李利斌','刘烨楠','孟祥钰','潘国屏'];
            break;
          case 8:
            data.multiArray[1] = ['沈越','徐凤萍'];
            break;
          case 9:
             data.multiArray[1] = ['韩仲凯'];
             break;
          case 10:
             data.multiArray[1] = ['张勇','王德建','陈赢','杨伟堂','张中印'];
             break;
           case 11:
            data.multiArray[1] = ['陈晨','李明宇','陈毅','马文庆','杨光','刘长军','马德浩'];
            break;
           case 12:
            data.multiArray[1] = ['杨有才'];
            break;
           case 13:
            data.multiArray[1] = ['周婷'];
            break;
           case 14:
            data.multiArray[1] = ['杜舒书'];
            break;
           case 15:
            data.multiArray[1] = ['刘艳','王喆'];
            break;
           case 16:
            data.multiArray[1] = ['李厚芝'];  
            break;
        }
        data.multiIndex[1]=0;
        break;
      }
    console.log(data.multiIndex);
    data.multiValue=[this.data.multiArray[0][this.data.multiIndex[0]],this.data.multiArray[1][this.data.multiIndex[1]]];
    console.log(data.multiValue)
    this.setData(data);
  },
  bindViewTap: function(){
    var cbb = encodeURIComponent(this.data.multiValue)
    app.globalData.ccc=this.data.multiValue;
    for(var i =0; i<showinfo.length;i++){var item = showinfo[i];
      if(item.class == app.globalData.ccc[0] && item.teacher == app.globalData.ccc[1]){
        this.setData(item);
        break;
      };
    }
    app.globalData.item=item;
    var caa = encodeURIComponent(item)
    wx.navigateTo({
      url:'../info/info?ccc='+caa,  
     // url:'../info/info',
    });
  },
  onShow: function (options) {
    let pages = getCurrentPages()
    var curPage = pages[pages.length - 1]; // 当前页面
  }
}
)

