// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({env:'chake-7g37b76526c08c7a'})

// 云函数入口函数
exports.main = async (event, context) => {
  db.collection('TestcmtCourses').add({
    data: {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      sort: event.sort,
      class: event.class,
      teacher: event.teacher,
      student: event.student,
      tag: event.tag,
      info: event.info,
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })
}