const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({env:'chake-7g37b76526c08c7a'})

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await db.collection('TestcmtCourses')
  .where({
    student: event.openid,
  })
  .field({
    _id:0,
    'sort':1,
    'class':1,
    'teacher':1,
  })
  .get()

  return result
}